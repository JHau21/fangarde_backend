const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const simulate_payment = (terminal_id) => {
	setTimeout(() => {
		return stripe.testHelpers.terminal.readers.presentPaymentMethod(terminal_id, {
			card_present: {
				number: "4242424242424242",
			},
			type: "card_present",
		});
	}, 2500);
};

/**
 * @param { String } type
 * @param { PaymentIntent } data
 * @returns { payment_intent_id: String }
 * If a card reader states that a payment succeeded, collect that payment and respond with a success
 * If a card reader states that a payment failed, respond with a failure
 */

module.exports = function (app) {
	app.post("/capture_payment_intent", async (request, response) => {
		const { payment_intent_id, terminal_id } = request.body;

		try {
			if (!payment_intent_id || !terminal_id || typeof payment_intent_id !== "string" || typeof terminal_id !== "string") {
				throw {
					code: 400,
					message: "Request body is missing critical fields.",
				};
			}

			if (process.env.STRIPE_TEST_MODE) {
				simulate_payment(terminal_id);
			}

			while (true) {
				const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

				if (!payment_intent || !payment_intent.id) {
					throw { code: 502, message: "Failed to retrieve payment intent." };
				}

				const card_reader = await stripe.terminal.readers.retrieve(terminal_id);

				if (!card_reader || !card_reader.id) {
					throw { code: 502, message: "Failed to retrieve card reader." };
				}

				const { action } = card_reader;

				const reader_status = action.status;
				const payment_intent_status = payment_intent.status;

				switch (reader_status) {
					case "succeeded": {
						if (payment_intent_status === "requires_capture") {
							const captured_payment_intent = await stripe.paymentIntents.capture(payment_intent.id);

							if (!captured_payment_intent || !captured_payment_intent.id) {
								throw { code: 502, message: "Failed to capture payment intent." };
							}

							return response.status(201).send({
								message: "Successfully captured payment intent!",
							});
						}

						break;
					}
					case "failed": {
						if (action.failure_code === "authentication_required") {
							return response.status(502).send({
								message: "Failed to process payment. Customer card required authentication!",
							});
						} else if (action.failure_code === "card_declined") {
							return response.status(502).send({
								message: "Failed to process payment. Customer card is declined!",
							});
						} else {
							return response.status(502).send({
								message: "Failed to process payment for unknown reason!",
							});
						}
					}
					default: {
						setTimeout(() => {}, 500);
					}
				}
			}
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
