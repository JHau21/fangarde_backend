const PromoCodes = require("../db/models/promocodes_model");

/**
 *
 * @param { String } event_id
 * @param { String } promo_code
 * @return { promo_code_doc: PromoCode }
 * this function takes in an event ID and promo code and checks if the code exists
 * if the code does exist on the event, it returns valid: true and the promo code metadata
 * if the code does not exist on the event, it return valid: false and an error
 */

module.exports = function (app) {
	app.post("/verify_promo_code", async (request, response) => {
		const { event_id, promo_code } = request.body;

		try {
			if (!event_id || !promo_code || typeof event_id !== "string" || typeof promo_code !== "string") {
				throw {
					code: 400,
					message: "Request body contains invalid fields.",
				};
			}

			const promo_code_doc = await PromoCodes.findOne({
				$and: [{ event_id: event_id }, { code: promo_code }],
			});

			if (!promo_code_doc || !promo_code_doc._id) {
				throw {
					code: 404,
					message: "Failed to find inputted promo code.",
				};
			}

			return response.status(200).send({
				message: "Promo code found!",
				promo_code_doc: promo_code_doc,
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
