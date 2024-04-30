const PromoCodes = require("../../../db/models/promocodes_model");

module.exports = async function (actual_cost, promo_code, event_id) {
	const promo_doc = await PromoCodes.find({
		$and: [{ event_id: event_id }, { code: promo_code }],
	});

	if (promo_doc.length > 0) {
		actual_cost -= parseFloat((actual_cost * promo_doc[0].discount).toFixed(2));
	}

	return parseFloat(actual_cost.toFixed(2));
};
