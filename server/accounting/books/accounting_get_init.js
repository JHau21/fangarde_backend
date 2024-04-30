const PastEvents = require("../../db/models/past_events_model");
const UpcomingEvents = require("../../db/models/events_model");

module.exports = function (app) {
	app.post("/get_init_accounting_events", async (request, response) => {
		const { id } = request.body;

		try {
			if (!id || typeof id !== "string") {
				throw { code: 400, message: "Request body is missing essential ID parameter!" };
			}

			const past_events = await PastEvents.find({ organization_id: id });
			const upcoming_events = await UpcomingEvents.find({ organization_id: id });

			const events = past_events.concat(upcoming_events);
			const message = events.length ? "Successfully fetched some events!" : "No events found!";

			return response.status(200).send({
				message: message,
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
