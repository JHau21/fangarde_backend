const UpcomingEvents = require("../../db/models/events_model.js");
const PastEvents = require("../../db/models/past_events_model.js");

module.exports = function (app) {
	app.post("/get_event_transactions", async (request, response) => {
		const { event_id } = request.body;

		try {
			if (!event_id || typeof event_id !== "string") {
				throw { code: 400, message: "Request body is missing event ID." };
			}

			const upcoming_event = await UpcomingEvents.findOne({ _id: event_id }).populate({
				path: "transactions",
				populate: {
					path: "order.ticket_type_id",
				},
			});

			const past_event = await PastEvents.findOne({ _id: event_id }).populate({
				path: "transactions",
				populate: {
					path: "order.ticket_type_id",
				},
			});

			let transactions = [];

			if (upcoming_event) transactions = upcoming_event.transactions;
			else if (past_event) transactions = past_event.transactions;

			const message = transactions.length ? "Successfully fetched transactions!" : "No transactions found!";

			return response.status(200).send({
				message: message,
				transactions: transactions,
			});
		} catch (err) {
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
