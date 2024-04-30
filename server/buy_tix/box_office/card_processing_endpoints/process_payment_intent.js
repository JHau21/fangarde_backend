const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { String } payment_intent_id
 * @param { String } terminal_id
 * @returns { message: String }
 * Attempts to get a specified payment intent to be processed by a card reader
 */

module.exports = function (app) {
	app.post("/process_payment_intent", async (request, response) => {
		const { payment_intent_id, terminal_id } = request.body;

		const MAX = 3;
		let attempt = 0;

		while (true) {
			attempt++;

			try {
				if (
					!payment_intent_id ||
					!terminal_id ||
					typeof payment_intent_id !== "string" ||
					typeof terminal_id !== "string"
				) {
					throw {
						code: 400,
						message: "Request body is missing critical fields.",
					};
				}

				const terminal = await stripe.terminal.readers.processPaymentIntent(terminal_id, {
					payment_intent: payment_intent_id,
				});

				if (!terminal || !terminal.id) {
					throw { code: 500, message: `Failed to handoff payment intent to reader ${terminal_id}.` };
				} else if (
					!terminal.action.process_payment_intent.payment_intent ||
					terminal.action.process_payment_intent.payment_intent !== payment_intent_id
				) {
					throw {
						code: 500,
						message: `Failed to start processing payment intent on reader ${terminal_id}`,
					};
				}

				return response.status(200).send({
					message: "Successfully connected to reader and started processing payment!",
				});
			} catch (error) {
				if (error.code) {
					const { code } = error;

					switch (code) {
						case "terminal_reader_timeout":
							if (attempt === MAX) {
								return response.status(504).send({
									message: "Timed out trying to reach card reader.",
								});
							}

							break;
						case "terminal_reader_offline":
							return response.status(502).send({
								message: "Card reader is offline.",
							});
						case "terminal_reader_busy":
							return response.status(503).send({
								message: "Card reader is already processing another order.",
							});
						case "intent_invalid_state":
							return response.status(400).send({
								message: "Card reader has already finished processing this order.",
							});
						default:
							return response.status(500).send({
								message: "Something went wrong when handing off the payment intent to the card reader.",
							});
					}
				} else if (error.code && error.message) {
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
		}
	});
};
