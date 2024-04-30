const mongoose = require("mongoose");

const ContactFormInfoSchema = new mongoose.Schema({
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
		required: [true, "Please provide an email!"],
		unique: false,
	},
	message: {
		type: String,
		required: [true, "Please provide a message!"],
		unique: false,
	},
	ip: {
		type: String,
		required: [true, "Please enter the IP address!"],
		unique: false,
	},
	time: {
		type: Date,
		required: [true, "Please include the time that the inquiry was submitted!"],
		unique: false,
	},
});

module.exports = mongoose.model.ContactFormInfo || mongoose.model("contact_inquiries", ContactFormInfoSchema);
