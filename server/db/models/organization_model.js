const mongoose = require("mongoose");
const { Event_Location } = require("./event_location");

const CustomEmailMessageSchema = new mongoose.Schema({
	thank_you_message: {
		type: String,
		required: false,
		unique: false,
		default: undefined,
	},
	additional_details_message: {
		type: String,
		required: false,
		unique: false,
		default: undefined,
	},
	image_option: {
		type: String,
		enum: ["org_banner", "event_search_image", "event_banner_image"],
		required: false,
		unique: false,
		default: undefined,
	},
});

const FinancialSettingsSchema = new mongoose.Schema({
	interval: {
		type: String,
		enum: ["weekly", "monthly", "yearly"],
		required: true,
		unique: false,
	},
	email_address: {
		type: String,
		required: true,
		unique: false,
	},
});

const MarketingCommunicationsSchema = new mongoose.Schema({
	requested: {
		type: Boolean,
		required: true,
		unique: false,
	},
	custom_message: {
		type: String,
		required: false,
		unique: false,
	},
});

const Terminal = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: false,
		default: "Terminal",
	},
	terminal_id: {
		type: String,
		required: true,
		unique: false, // this is tentative decision and eventually every terminal ID should be unique
		default: "tmr_xxx",
	},
	registration_code: {
		type: String,
		required: true,
		unique: false, // this is tentative decision and eventually every terminal ID should be unique
		default: "anonymous-terminal",
	},
});

const OrganizationSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
	},
	stripe_conn_id: {
		type: String,
		required: false,
		unique: true,
	},
	name: {
		type: String,
		required: [true, "Please provide a name!"],
		unique: false,
	},
	description: {
		type: String,
		required: false,
		unique: false,
	},
	locations: {
		type: [Event_Location],
		required: [false, "Please provide a location!"],
		unique: false,
	},
	genre: {
		type: String,
		enum: ["Sports", "Theater", "Comedy", "Concerts", "Conferences", "Arts", "Festivals", "Symphony", "Music", "None"],
		required: [true, "Please indicate the type of events you host!"],
		unique: false,
	},
	website: {
		type: String,
		required: false,
		unique: false,
	},
	pictures: {
		type: [mongoose.Schema.Types.Mixed],
		required: false,
		unique: false,
	},
	admins: {
		type: [mongoose.Types.ObjectId],
		required: false,
		unique: false,
		ref: "admin",
	},
	number_events_annual: {
		type: Number,
		required: [true, "Please provide number of events!"],
		unique: false,
	},
	num_locations: {
		type: Number,
		required: [true, "Please provide number of locations!"],
		unique: false,
	},
	num_attendee_per_event: {
		type: Number,
		required: [true, "Please provide number of attendees!"],
		unique: false,
	},
	banner: {
		type: String,
		required: false,
		unique: false,
	},
	financial_settings: {
		type: FinancialSettingsSchema,
		required: true,
		unique: false,
	},
	custom_email_message: {
		type: CustomEmailMessageSchema,
		required: false,
		unique: false,
		default: undefined,
	},
	request_marketing_communications: {
		type: MarketingCommunicationsSchema,
		required: true,
		unique: false,
		default: {
			requested: false,
			custom_message: "",
		},
	},
	mailing_list: {
		type: [String],
		required: true,
		unique: false,
		default: [],
	},
	location_id: {
		type: String,
		required: true,
		unique: false, // this is tentative decision and eventually every location ID should be unique
		default: undefined,
	},
	terminals: {
		type: [Terminal],
		required: false,
		unique: false,
		default: [],
	},
});

module.exports = mongoose.model.Organization || mongoose.model("Organization", OrganizationSchema);
