const PromoCodes = require("../db/models/promocodes_model");

module.exports = function (app) {
	app.post("/update_promo_code", (request, response) => {
		const { _id, promo_code } = request.body;

		PromoCodes.where({ _id: _id })
			.updateOne({
				...promo_code,
			})
			.then((promo_codes) =>
				response.status(201).send({
					message: "Successfully updated promo code!",
					promo_codes: promo_codes,
				})
			)
			.catch((err) =>
				response.status(500).send({
					message: "Failed to update promo code!",
					error: err,
				})
			);
	});
};
