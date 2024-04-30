const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		// required: [true, "Please provide an Admin ID!"],
		// unique: true
	},
	stripe_rep_id: {
		type: String,
		required: false,
		unique: true,
	},
	organization_id: {
		type: mongoose.Types.ObjectId,
		required: [true, "Please provide an organization ID!"],
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
		required: [true, "Please provide an email address!"],
		unique: [true, "Email already exists"],
	},
	password: {
		type: String,
		required: false,
		unique: false,
	},
	role: {
		type: String,
		enum: ["Root Admin", "General Admin"],
		required: [true, "Please provide a role!"],
		unique: false,
	},
	phone_number: {
		type: String,
		required: false,
		unique: false,
	},
	profile_picture: {
		type: String, // casted to MongoDB's BSON type: binData
		required: false,
		unique: false,
	},
});

module.exports = mongoose.model.Admin || mongoose.model("admin", AdminSchema);
