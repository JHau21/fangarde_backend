const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const TransactionSchema = new Schema({
	_id: {
		type: Types.ObjectId,
		required: [true, "Please provide a Transaction ID!"],
		unique: false,
	},
	charge_id: {
		type: String,
		required: false,
		unique: false,
		default: undefined,
	},
	organization_id: {
		type: Types.ObjectId,
		require: [true, "Please provide the associated organization for this transaction."],
		unique: false,
	},
	order: {
		type: [
			{
				ticket_name: {
					type: String,
					required: [true, "Please provide the name of the ticket type!"],
					unique: false,
				},
				ticket_tier: {
					type: {
						price: {
							type: Number,
							required: [true, "Please enter the price for this ticket tier!"],
							unique: false,
						},
						name: {
							type: String,
							required: [true, "Please enter the name for this ticket tier!"],
							unique: false,
						},
					},
					required: [true, "Please provide the name of the ticket tier."],
					unique: false,
				},
				ticket_type_id: {
					type: Types.ObjectId,
					required: [true, "Please provide the ticket type ID for this set of tickets!"],
					unique: false,
					ref: "Ticket_Types",
				},
				ticket_ids: {
					type: [Types.ObjectId],
					required: [true, "Please provide IDs of all ticket generated from this order subset!"],
					unique: false,
					ref: "tickets",
				},
				quantity: {
					type: Number,
					required: [true, "Please provide the number of tickets purchased in this order subset!"],
					unique: false,
				},
			},
		],
		required: [true, "Please provide the order details for this purchase!"],
		unique: false,
	},
	last_four_card_digits: {
		type: String,
		required: [true, "Please provide the last four digits of the card used in this transaction!"],
		unique: false,
	},
	time: {
		type: Date,
		required: [true, "Please provide the date of this transaction!"],
		unique: false,
	},
	transaction_type: {
		type: String,
		required: [true, "Please provide the type of transaction (card, cash, free)!"],
		unique: false,
		enum: ["card", "cash", "free"],
	},
	transaction_fee: {
		type: Number,
		required: [true, "Please provide the fee for this transaction!"],
		unique: false,
	},
	sale_location: {
		type: String,
		required: [true, "Please provide the sale location (at_the_door, online)!"],
		unique: false,
		enum: ["at_the_door", "online"],
	},
	consumer_cost: {
		type: Number,
		required: [true, "Please provide the size of the bill we are charging the consumer!"],
		unique: false,
	},
	actual_cost: {
		type: Number,
		required: [true, "Please provide the actual cost of the bill before rounding!"],
		unique: false,
	},
	unrounded_customer_profit: {
		type: Number,
		required: [true, "Please provide the unrounded customer profit from the transaction!"],
		unique: false,
	},
	rounded_customer_profit: {
		type: Number,
		required: [true, "Please provide the rounded customer profit from the transaction!"],
		unique: false,
	},
	first_name: {
		type: String,
		required: false,
		unique: false,
	},
	last_name: {
		type: String,
		required: false,
		unique: false,
	},
	email: {
		type: String,
		required: false,
		unique: false,
	},
	donation_id: {
		type: Types.ObjectId,
		required: false,
		unique: false,
	},
	opted_into_mailing_list: {
		type: Boolean,
		required: [true, "On initialization, you should indicate if this user is opted in for mailing communications"],
		unique: false,
		default: false,
	},
	refunded: {
		type: Boolean,
		required: [true, "On initialization you should just set this to 'false'"],
		unique: false,
		default: false,
	},
});

module.exports = model.Transaction || model("transactions", TransactionSchema);
