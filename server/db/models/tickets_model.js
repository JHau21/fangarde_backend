const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const TicketSchema = Schema({
	transaction_id: {
		type: Types.ObjectId,
		required: [
			true,
			"Please enter the associated transaction ID for this individual ticket!",
		],
		unique: false,
	},
	event_id: {
		type: Types.ObjectId,
		required: [
			true,
			"Please enter the associated event ID for this individual ticket!",
		],
		unique: false,
	},
	user_id: {
		type: Types.ObjectId,
		required: false, // it's possible to have semi-anonymously purchased tickets
		unique: false,
	},
	ticket_type: {
		type: Types.ObjectId,
		required: [
			true,
			"Please enter the title of the ticket type for this individual ticket!",
		],
		unique: false,
	},
	consumer_field_inputs: {
		type: [
			{
				field_question: {
					type: String,
					required: [
						true,
						"Please enter the field question included for this individual ticket at purchase!",
					],
					unique: false,
				},
				consumer_response: {
					type: String,
					required: [
						true,
						"Please enter the consumer response included for this individual ticket at purchase!",
					],
					unique: false,
				},
			},
		],
		default: undefined,
		required: false,
		unique: false,
	},
});

module.exports = model.Tickets || model("tickets", TicketSchema);
