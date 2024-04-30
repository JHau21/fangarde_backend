const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: [true, "Please provide a first name!"],
		unique: false,
	},
	last_name: {
		type: String,
		required: [true, "Please provide a last name!"],
		unique: false,
	},
	email: {
		type: String,
		required: [true, "Please provide an Email!"],
		unique: [true, "Email already Exists"],
	},
	password: {
		type: String,
		required: [true, "Please provide a password!"],
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

module.exports = mongoose.model.Users || mongoose.model("users", UserSchema);
