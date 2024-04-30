const mongoose = require("mongoose");

const DonationsSchema = new mongoose.Schema({
	transaction_id: {
		type: mongoose.Types.ObjectId,
		required: [true, "Please provide the transaction ID for this donation!"],
		unique: false,
	},
	event_id: {
		type: mongoose.Types.ObjectId,
		required: [true, "Please provide the event ID for this donation!"],
		unique: false,
	},
	first_name: {
		type: String,
		required: [true, "Please provide a name!"],
		unique: false,
	},
	last_name: {
		type: String,
		required: [true, "Please provide a name!"],
		unique: false,
	},
	email: {
		type: String,
		required: [true, "Please provide an Email!"],
		unique: false,
	},
	donation_type: {
		type: String,
		required: [true, "Please provide the type of donation made!"],
		unique: false,
	},
	donation_amount: {
		type: String,
		required: [true, "Please provide the donation amount!"],
		unique: false,
	},
	refunded: {
		type: Boolean,
		required: [true, "On initialization you should just set this to 'false'."],
		unique: false,
		default: false,
	},
});

module.exports = mongoose.model.Donations || mongoose.model("donations", DonationsSchema);
