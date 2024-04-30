const PromoCodes = require("../db/models/promocodes_model");

module.exports = function (app) {
	app.post("/delete_promo_codes", (request, response) => {
		const { ids } = request.body;

		if (ids.length > 0) {
			PromoCodes.deleteMany({
				_id: { $in: ids },
			})
				.then((promo_doc) =>
					response.status(201).send({
						message: "Promo codes successfully deleted!",
						promo_doc: promo_doc,
					})
				)
				.catch((err) =>
					response.status(500).send({
						message: "Failed to delete some or all promo codes!",
						error: err,
					})
				);
		} else {
			response.status(500).send({
				message: "Need to pass array of promo code IDs to be deleted!",
			});
		}
	});
};
