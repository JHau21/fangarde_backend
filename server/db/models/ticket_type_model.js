const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

/*
	Temporary fix for smart contract failing and enuring the tickets work
	I added a false to the contract and contract abi, they are no longer required
	This is not an adequate fix, but it will allow us to continue working on the project
	without having to worry about the smart contract failing
 */

const CustomTicketMessageSchema = new Schema({
	title: {
		type: String,
		required: false,
		unique: false,
	},
	content: {
		type: String,
		required: false,
		unique: false,
	},
});

const TicketTypeSchema = Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		required: false,
	},
	event_id: {
		type: mongoose.Types.ObjectId,
		required: [true, "Attach the event ID to this ticket!"],
		unique: false,
	},
	ticket_name: {
		type: String,
		required: [true, "Please enter the name of this ticket type!"],
		unique: false,
	},
	price: {
		type: mongoose.Types.Decimal128,
		required: false,
		unique: false,
	},
	number_of_tickets: {
		type: Number,
		required: [true, "Please enter the number of this ticket type initially in circulation!"],
		unique: false,
	},
	ticket_tier: {
		type: String,
		required: [true, "Please enter the tier of this ticket type!"],
		unique: false,
	},
	release_time: {
		type: Date,
		required: [true, "Please enter the date of start sale for this ticket type!"],
		unique: false,
	},
	stop_sale_time: {
		type: Date,
		required: [true, "Please enter the date of stop sale for this ticket type!"],
		unique: false,
	},
	resellable: {
		type: Boolean,
		required: [true, "Please enter whether or not this ticket type is resellable!"],
		unique: false,
	},
	transferrable: {
		type: Boolean,
		required: [true, "Please enter whether or not this ticket type is transferrable!"],
		unique: false,
	},
	seat_holds: {
		type: {
			num_seat_holds: {
				type: Number,
				required: [true, "Please enter the number of seat holds for this ticket type!"],
				unique: false,
			},
			seat_holds_release_type: {
				type: String,
				enum: ["timed", "ticket", "none"],
				required: [true, "Please enter the type of seat hold release for this ticket type!"],
				unique: false,
			},
			seat_hold_release_time: {
				type: Date,
				required: [false],
				unique: false,
			},
			seat_hold_release_ticket_type_id: {
				type: mongoose.Types.ObjectId,
				required: [false],
				unique: false,
			},
		},
		default: undefined,
		required: false,
		unique: false,
	},
	merchandise: {
		type: [
			{
				name: {
					type: String,
					required: [true, "Please enter the name of the merchandise!"],
					unique: false,
				},
				item: {
					type: String,
					required: [true, "Please enter the item of merchandise!"],
					unique: false,
				},
				sales_tax_included: {
					type: Boolean,
					required: [true, "Please indicate whether or not to the sales of this merchandise to the ticket price!"],
					unique: false,
				},
				consumer_fields: {
					type: [
						{
							field_title: {
								type: String,
								required: [true, "Please enter the name of the merchandise!"],
								unique: false,
							},
						},
					],
					required: [true, "Please add the fields you want consumer to fill out to get their merchandise!"],
					unique: false,
				},
			},
		],
		default: undefined,
		required: [false, "If this ticket comes with merchandise, please enter that merchandise!"],
		unique: false,
	},
	//TODO  Commenting out anythign related to the smart contract for now
	// contract_address: {
	// 	type: String,
	// 	required: false, // This is a temporary fix, please see above for more information // TODO: Change this back to true
	// 	unique: false,
	// },
	// abi: {
	// 	type: [
	// 		{
	// 			anonymous: {
	// 				type: Boolean,
	// 				required: false,
	// 				unique: false,
	// 			},
	// 			inputs: [
	// 				{
	// 					indexed: {
	// 						type: Boolean,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					internalType: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					name: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					type: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 				},
	// 			],
	// 			outputs: [
	// 				{
	// 					indexed: {
	// 						type: Boolean,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					internalType: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					name: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 					type: {
	// 						type: String,
	// 						required: false,
	// 						unique: false,
	// 					},
	// 				},
	// 			],
	// 			payable: {
	// 				type: Boolean,
	// 				required: false,
	// 				unique: false,
	// 			},
	// 			stateMutability: {
	// 				type: String,
	// 				required: false,
	// 				unique: false,
	// 			},
	// 			type: {
	// 				type: String,
	// 				required: false,
	// 				unique: false,
	// 			},
	// 			name: {
	// 				type: String,
	// 				required: false,
	// 				unique: false,
	// 			},
	// 		},
	// 	],
	// 	required: [false, "Please make sure to add the smart contract abi!"], // TODO: make this true
	// 	unique: false,
	// },
	// contract_error: {
	// 	// TODO: get rid of this
	// 	type: String,
	// 	required: false,
	// 	unique: false,
	// },
	custom_ticket_message: {
		type: CustomTicketMessageSchema,
		required: false,
		unique: false,
		default: undefined,
	},
});

module.exports = model.TicketTypes || model("Ticket_Types", TicketTypeSchema);
