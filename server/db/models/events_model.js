const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const TicketTypes = require("./ticket_type_model");
const { Event_Location } = require("./event_location");

const EventsSchema = new Schema({
	_id: {
		type: Types.ObjectId,
		required: [true, "Please provide an upcoming events ID!"],
		unique: false,
	},
	organization_id: {
		type: Types.ObjectId,
		required: [true, "Please provide an organization ID!"],
		unique: false,
	},
	name: {
		type: String,
		required: [true, "Please provide the name of this event!"],
		unique: false,
	},
	subtitle: {
		type: String,
		required: false,
		unique: false,
	},
	description: {
		type: String,
		required: false,
		unique: false,
	},
	location: {
		type: Event_Location,
		required: [true, "Please provide the location for this event!"],
		unique: false,
	},
	ticket_types: {
		type: [Types.ObjectId],
		required: [false, "Please provide the information for the relevant ticket types!"],
		unique: false,
		ref: "Ticket_Types",
	},
	transactions: {
		type: [Types.ObjectId],
		required: [true, "Please enter the current number of transaction IDs!"],
		unique: false,
		ref: "transactions",
	},
	event_start_time: {
		type: Date,
		required: [true, "Please enter the start time of this event!"],
		unique: false,
	},
	event_end_time: {
		type: Date,
		required: [true, "Please enter the end time of this event!"],
		unique: false,
	},
	indoors_outdoors: {
		type: String,
		enum: ["Indoors", "Outdoors"],
		required: [true, "Please enter whether this event is indoors or outdoors!"],
		unique: false,
	},
	age_restriction: {
		type: String,
		default: undefined,
		required: [false, "If this is age restricted, please enter the restriction!"],
		unique: false,
	},
	serving_food: {
		type: [
			{
				food_name: {
					type: String,
					required: [true, "Please enter the name of the dished of food!"],
					unique: false,
				},
				food_ingredients: {
					type: String,
					required: [true, "Please enter the ingredients of the dish!"],
					unique: false,
				},
				food_description: {
					type: String,
					required: [true, "Please describe the dish!"],
					unique: false,
				},
				allergy_warning: {
					type: String,
					required: [
						false,
						"If the dish contains ingredients that attendees may be allergic to, include those here!",
					],
					unique: false,
				},
			},
		],
		default: undefined,
		required: [false, "If the event is serving food, provide information on the respective dishes!"],
		unique: false,
	},
	admission_type: {
		type: String,
		enum: ["Guest List", "Tickets"],
		required: [true, "Please enter the admission type for this event!"],
		unique: false,
	},
	access_type: {
		type: String,
		enum: ["Public", "Private"],
		required: [true, "Please enter whether this event is public fo private!"],
		unique: false,
	},
	genre: {
		type: String,
		enum: ["None", "Concerts", "Sports", "Theater", "Comedy", "Arts", "Festivals", "Symphony", "Conferences", "Music"],
		required: [true, "Please indicate the genre of this event!"],
		unique: false,
	},
	search_image: {
		type: String,
		required: false,
	},
	banner: {
		type: String,
		required: false,
	},
	donations: {
		type: Boolean,
		required: [true, "Do you want donations or not?"],
	},
	donation_type: {
		type: String,
		enum: ["percentage", "flat"],
		required: false,
	},
	donation_message: {
		type: String,
		required: false,
	},
	donation_options: {
		type: [Number],
		required: false,
	},
	color_scheme: {
		type: {
			primary_color: {
				type: String,
				required: [false, "If the event requires a color scheme, enter the primary color of the event!"],
				unique: false,
			},
			secondary_color: {
				type: String,
				required: [false, "If the event requires a color scheme, enter the secondary color of the event!"],
				unique: false,
			},
		},
		required: false,
	},
});

module.exports = model.Upcoming_Events || model("Upcoming_Events", EventsSchema);
