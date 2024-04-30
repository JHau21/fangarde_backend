const Event = require("../db/models/events_model.js");
const TicketType = require("../db/models/ticket_type_model");
const mongoose = require("mongoose");
const { Types } = mongoose;
const admin_auth = require("../auth/admin_auth");
const uploadImageToStorage = require("../firebase/upload_file");

/**
 *
 * @param {Request = { event: Event }} request
 * @param {Response} response
 * takes as input an Event object with all event details besides _id filled in
 * generates an event _id
 * returns that newly created event object
 */

module.exports = function (app) {
	app.post("/create_guest_list_event", admin_auth, async (request, response) => {
		const { user } = request;
		const { event } = request.body;
		const { banner, search_image } = event;

		// Upload images to Firebase Cloud Storage and get their URLs
		let temp_new_event = {
			_id: new Types.ObjectId(), // Generate the object ID
			...event,
			organization_id: user.organizationId,
		};
		let bannerUrl = "",
			searchImageUrl = "";
		if (banner) {
			bannerUrl = await uploadImageToStorage(`banners/${event._id}`, banner);
			temp_new_event.banner = bannerUrl;
		}
		if (search_image) {
			searchImageUrl = await uploadImageToStorage(`search_images/${event._id}`, search_image);
			temp_new_event.search_image = searchImageUrl;
		}

		Event.create(temp_new_event)
			.then((new_event) => {
				response.status(201).send({
					message: "Event Created Successfully!",
					result: { new_event },
					error: false,
				});
			})
			.catch((err) => {
				response.status(500).send({
					message: "An error occurred, when creating your event. Please try again later.",
					error: true,
					err,
				});
			});
	});
};
