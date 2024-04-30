const PromoCodes = require("../db/models/promocodes_model");
const mongoose = require("mongoose");
const { Types } = mongoose;

module.exports = function (app) {
	app.post("/create_promo_code", async (request, response) => {
		const promo_codes = request.body.promo_codes;

		try {
			let results = await Promise.all(
				promo_codes.map(async (promo) => {
					let { _id, code, name, discount, event_id } = promo;

					if (discount > 0.99) {
						discount /= 100;
					}

					if (discount <= 1 && discount >= 0) {
						if (_id) {
							// Update existing promo code
							return PromoCodes.findByIdAndUpdate(
								_id,
								{ name, code, discount, event_id },
								{ new: true }
							);
						} else {
							// Create a new promo code
							return PromoCodes.create({
								name,
								code,
								discount,
								event_id,
							});
						}
					} else {
						throw new Error(
							"Promo code needs to have a valid discount value between 0 and 1."
						);
					}
				})
			);

			results = results.map(
				({ _id, name, code, discount, event_id }) => {
					return {
						_id: _id,
						name: name,
						code: code,
						discount: discount * 100,
						event_id: event_id,
					};
				}
			);

			response.status(201).send({
				message: "Promo codes processed successfully!",
				results,
			});
		} catch (err) {
			response.status(500).send({
				message: "An error occurred while processing the promo codes!",
				error: err.message || err,
			});
		}
	});
};
