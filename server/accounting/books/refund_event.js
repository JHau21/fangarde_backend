const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const UpcomingEvents = require("../../db/models/events_model");
const PastEvents = require("../../db/models/past_events_model");
const Transactions = require("../../db/models/transactions_model");
const Donations = require("../../db/models/donations_model");
const TicketTypes = require("../../db/models/ticket_type_model");

const fetch_event_and_transactions = async (id) => {
	let event;

	event = await UpcomingEvents.findOne({ _id: id }).populate({ path: "transactions" });

	if (!event) {
		event = await PastEvents.findOne({ _id: id }).populate({ path: "transactions" });

		return event;
	}

	return event;
};

module.exports = async function (app) {
	app.post("/refund_event", (request, response) => {
		const { id } = request.body;

		if (id && typeof id === "string") {
			fetch_event_and_transactions(id)
				.then(async (event) => {
					if (event) {
						const { transactions } = event;

						if (transactions.length > 0) {
							return transactions;
						} else {
							response.status(500).send({
								refunds: [],
								message: `Could not find any transactions for this event!`,
							});
						}
					} else {
						response.status(500).send({
							refunds: [],
							message: `Could not find event matching ID ${id}!`,
						});
					}
				})
				.then(async (transactions) => {
					let refunded_transaction_ids = [];
					const num_transactions = transactions.length;
					let refund;
					let donation;

					for (const transaction of transactions) {
						const { charge_id, _id, donation_id, order, refunded, transaction_type } = transaction;

						if (!refunded && transaction_type === "card") {
							if (donation_id) {
								donation = await Donations.findOne({ _id: donation_id });

								const { consumer_cost, rounded_customer_profit } = transaction;
								const { donation_amount, donation_type } = donation;

								let refund_amt = consumer_cost;

								// we seriously need to refactor how we handle donations... fml
								if (donation_type === "percentage") {
									const donation_value = (
										rounded_customer_profit / Number(1 + Number(donation_amount) / 100).toFixed(2)
									).toFixed(2); // just in case...

									refund_amt = (consumer_cost - (rounded_customer_profit - Number(donation_value))) * 100;
								} else if (donation_type === "flat") {
									refund_amt = (consumer_cost - Number(donation_amount).toFixed(2)) * 100; // just in case...
								}

								refund_amt = refund_amt.toFixed(0); // just in case...

								refund = await stripe.refunds.create({
									amount: refund_amt,
									charge: charge_id,
									reverse_transfer: true,
									refund_application_fee: true, // for right now we'll also refund the fee we took
								});
							} else {
								refund = await stripe.refunds.create({
									charge: charge_id,
									reverse_transfer: true,
									refund_application_fee: true, // for right now we'll also refund the fee we took
								});
							}

							if (refund) {
								for (const purchase of order) {
									const { ticket_type_id, quantity } = purchase;

									await TicketTypes.findByIdAndUpdate(ticket_type_id, {
										$inc: { number_of_tickets: quantity },
									});
								}

								refunded_transaction_ids.push(_id);

								await Transactions.findByIdAndUpdate(_id, {
									refunded: true,
								});
							}
						}
					}

					return { refunded_transaction_ids, num_transactions };
				})
				.then(({ refunded_transaction_ids, num_transactions }) =>
					response.status(201).send({
						refunds: refunded_transaction_ids,
						total_transactions: num_transactions,
						message: "Event successfully refunded!",
					})
				)
				.catch((err) =>
					response.status(500).send({
						refunds: [],
						error: err,
						message: "Failed to refund event!",
					})
				);
		} else {
			response.status(500).send({
				refunds: [],
				message: "Failed to refund transaction! Missing transaction_id in payload!",
			});
		}
	});
};
