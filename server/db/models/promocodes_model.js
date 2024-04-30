const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const PromoCodesSchema = Schema({
	name: {
		type: String,
		required: [true, "Please enter the name of this promocode!"],
		unique: false,
	},
	code: {
		type: String,
		required: [true, "Please enter the code for this promocode!"],
		unique: false,
	},
	discount: {
		type: Number,
		required: [true, "Please enter the discount in decimal format for this promocode!"],
		unique: false,
	},
	event_id: {
		type: Types.ObjectId,
		required: [true, "Please enter an associated event for this ticket type!"],
		unique: false,
	},
});

module.exports = model.Promocodes || model("Promo_Codes", PromoCodesSchema);
