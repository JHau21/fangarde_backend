const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Transactions = require("../../db/models/transactions_model");
const Donations = require("../../db/models/donations_model");
const TicketTypes = require("../../db/models/ticket_type_model");

// if we refund a single transactions, we should dump the tickets back into circulation
// this will involve modifying the ticket types

module.exports = function (app) {
	app.post("/refund_transaction", (request, response) => {
		const { id } = request.body;

		let total_order;

		if (id && typeof id === "string") {
			Transactions.find({
				_id: id,
				actual_cost: { $gt: 0 },
				consumer_cost: { $gt: 0 },
				charge_id: { $exists: true },
				refunded: false,
			})
				.then(async (transaction) => {
					if (transaction.length > 0) {
						const { charge_id, actual_cost, donation_id, order } = transaction[0];

						total_order = order;

						if (!charge_id) {
							response.status(500).send({
								refunds: [],
								message: "Transaction is missing property 'charge_id'. Stripe cannot refund transactions missing this property!",
							});
						} else if (!actual_cost) {
							response.status(500).send({
								refunds: [],
								message: "Transaction is missing property 'actual_cost'. Fangarde cannot process refunds that lack this property!",
							});
						} else {
							let donation;
							let refund;

							// we seriously need to refactor how we handle donations... fml
							if (donation_id) {
								donation = await Donations.find({ _id: donation_id });

								const { consumer_cost, rounded_customer_profit } = transaction[0];
								const { donation_amount, donation_type } = donation[0];

								let refund_amt = consumer_cost;

								// we seriously need to refactor how we handle donations... fml
								if (donation_type === "percentage") {
									const donation_value = (
										rounded_customer_profit / Number(1 + Number(donation_amount) / 100).toFixed(2)
									).toFixed(2);

									refund_amt = (consumer_cost - (rounded_customer_profit - Number(donation_value))) * 100;
								} else if (donation_type === "flat") {
									refund_amt = (consumer_cost - Number(donation_amount).toFixed(2)) * 100; // just in case...
								}

								refund_amt = refund_amt.toFixed(0);

								refund = await stripe.refunds.create({
									amount: refund_amt,
									charge: charge_id,
									reverse_transfer: true,
									refund_application_fee: true,
								});
							} else {
								refund = await stripe.refunds.create({
									charge: charge_id,
									reverse_transfer: true,
									refund_application_fee: true,
								});
							}

							if (!refund) {
								response.status(500).send({
									refunds: [],
									message: "The refund failed for an unspecified reason. Please contact us!",
								});
							}

							for (const purchase of order) {
								const { ticket_type_id, quantity } = purchase;

								await TicketTypes.findByIdAndUpdate(ticket_type_id, {
									$inc: { number_of_tickets: quantity },
								});
							}
						}
					} else {
						response.status(500).send({
							refunds: [],
							message: "Cannot find transaction!",
						});
					}
				})
				.then(() =>
					Transactions.findByIdAndUpdate(id, {
						refunded: true,
					})
				)
				.then(() =>
					response.status(201).send({
						refunds: [id],
						total_transactions: 1,
						message: "Transaction successfully refunded!",
					})
				)
				.catch((err) =>
					response.status(500).send({
						refunds: [],
						error: err,
						message: "Failed to refund transaction!",
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
