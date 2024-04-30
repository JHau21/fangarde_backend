const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const calculate_fee = require("../../utils/calculate_fee");

/**
 * @param { Order } order
 * @returns { consumer_bill_unrounded: Number }
 * @returns { total_paid_tickets: Number }
 * Takes in an order and computes the total number of paid tickets purchased and the consumer's bill
 */

const compute_order_amount = (order) => {
	let consumer_bill_unrounded = 0;
	let total_paid_tickets = 0;
	let total_tickets = 0;

	for (const ticket_option of order) {
		const { ticket_type, sold } = ticket_option;

		if (!ticket_type || !ticket_type._id) {
			throw { code: 400, message: "Consumer order item is missing a ticket type!" };
		} else if (!sold || !sold.length) {
			throw { code: 400, message: "Consumer order item is missing sold field." };
		}

		for (const sold_item of sold) {
			const { ticket_tier, quantity } = sold_item;

			if (quantity > 0) {
				total_tickets += quantity;

				const price = ticket_tier.price;

				if (price < 0) {
					throw { code: 400, message: `Ticket price cannot be a negative value! Server received ${price}.` };
				} else {
					consumer_bill_unrounded += price * quantity;

					if (price > 0) {
						total_paid_tickets += quantity;
					}
				}
			} else if (quantity < 0) {
				throw { code: 400, message: `Sold quantity cannot be a negative value! Server received ${quantity}.` };
			}
		}
	}

	if (total_tickets === 0) {
		throw { code: 400, message: "The request body was sent without any selected tickets!" };
	}

	return {
		consumer_bill_unrounded,
		total_paid_tickets,
	};
};

/**
 * @param { Number } amount
 * @param { String } stripe_conn_id
 * @returns { payment_intent_id: String }
 * Creates a payment intent for a set of order data
 */

module.exports = function (app) {
	app.post("/create_payment_intent", async (request, response) => {
		const { order, stripe_conn_id } = request.body;

		try {
			if (!stripe_conn_id || typeof stripe_conn_id !== "string") {
				throw {
					code: 400,
					message: "Request body is missing critical fields.",
				};
			}

			const { consumer_bill_unrounded, total_paid_tickets } = await compute_order_amount(order);

			const { service_fee, processing_fee } = await calculate_fee(
				parseFloat(consumer_bill_unrounded.toFixed(2)),
				0,
				total_paid_tickets,
				"at_the_door"
			);

			if (!service_fee || !processing_fee || service_fee <= 0 || processing_fee <= 0) {
				throw { code: 500, message: "Failed to correctly calculate the fee on the order." };
			}

			const fangarde_fee = parseFloat(((service_fee + processing_fee) * 100).toFixed(2));

			const consumer_bill_cents = parseFloat((consumer_bill_unrounded * 100).toFixed(2));

			const payment_intent = await stripe.paymentIntents.create({
				currency: "usd",
				payment_method_types: ["card_present"],
				capture_method: "manual",
				amount: consumer_bill_cents, // total bill
				application_fee_amount: fangarde_fee, // our cut
				description: "Fangarde INC. Tickets",
				statement_descriptor: "FANGARDE INC.",
				statement_descriptor_suffix: "Fangarde INC.",
				transfer_data: {
					destination: stripe_conn_id,
				},
			});

			if (!payment_intent || !payment_intent.id) {
				throw { status: 500, message: "Failed to create payment intent for the order." };
			}

			return response.status(201).send({
				payment_intent_id: payment_intent.id,
			});
		} catch (error) {
			if (error.code && error.message) {
				const { code, message } = error;

				console.log(message);

				return response.status(code).send({
					message: message,
				});
			} else {
				return response.status(500).send({
					error: error,
				});
			}
		}
	});
};
