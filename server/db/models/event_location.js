const mongoose = require("mongoose");

const Address = new mongoose.Schema({
	street: {
		type: String,
		required: [true, "Please provide a street address!"],
		unique: false,
	},
	zip: {
		type: String,
		required: [true, "Please provide a zip code!"],
		unique: false,
	},
	state: {
		type: String,
		required: [true, "Please provide a state!"],
		unique: false,
	},
	city: {
		type: String,
		required: [true, "Please provide a city!"],
		unique: false,
	},
});

export const Event_Location = new mongoose.Schema({
	address: {
		type: Address,
		required: [true, "Please provide an address!"],
		unique: false,
	},
	name: {
		type: String,
		required: [true, "Please provide a name!"],
		unique: false,
	},
	type: {
		type: String,
		enum: ["online", "physical", "tba"],
		required: [true, "Please indicate the type of location!"],
		unique: false,
	},
	meeting_url: {
		type: String,
		required: false,
		unique: false,
	},
	additional_location_info: {
		type: String,
		required: false,
		unique: false,
	},
	_id: {
		type: mongoose.Types.ObjectId,
		required: true,
		unique: true,
	},
});
