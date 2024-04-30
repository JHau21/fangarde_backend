const UpcomingEvents = require("../db/models/events_model");
const PastEvents = require("../db/models/past_events_model");

module.exports = function (app) {
	app.post("/fetch_pos_events", async (request, response) => {
		const { org_id } = request.body;

		let events = [];
		const now = new Date();

		try {
			if (!org_id || typeof org_id !== "string") {
				throw { code: 400, message: "Missing critical request body fields!" };
			}

			const upcoming_events = await UpcomingEvents.find({
				organization_id: org_id,
			})
				.populate("ticket_types")
				.sort({ event_start_time: -1 });

			events = upcoming_events;

			const past_events = await PastEvents.find({
				$and: [
					{ organization_id: org_id },
					{
						event_end_time: { $gt: now.toISOString() },
					},
				],
			})
				.populate("ticket_types")
				.sort({ event_start_time: -1 });

			events = [...events, ...past_events];

			return response.status(200).send({
				message: "Upcoming and active Point of Sale events found!",
				events: events,
			});
		} catch (error) {
			if (error.code && error.message) {
				const { code, message } = error;

				console.log(message);

				return response.status(code).send({
					message: message,
				});
			} else {
				return response.status(500).send({
					error: error,
				});
			}
		}
	});
};
