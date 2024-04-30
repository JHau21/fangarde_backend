const PromoCodes = require("../db/models/promocodes_model");

module.exports = function (app) {
	app.post("/fetch_promo_codes", (request, response) => {
		const { event_id } = request.body;

		PromoCodes.find({
			event_id: event_id,
		})
			.then((promo_codes) => {
				if (promo_codes.length > 0) {
					promo_codes = promo_codes.map((promo_code) => {
						const { _id, name, code, discount, event_id } =
							promo_code;

						return {
							_id: _id,
							name: name,
							code: code,
							discount: discount * 100,
							event_id: event_id,
						};
					});

					response.status(201).send({
						message: "Successfully fetched promo codes!",
						promo_codes: promo_codes,
					});
				} else {
					response.status(201).send({
						message: "No promo codes found!",
						promo_codes: [],
					});
				}
			})
			.catch((err) =>
				response.status(500).send({
					message: "Failed to fetch promo codes!",
					error: err,
				})
			);
	});
};
