const Events = require("../db/models/events_model");
const Organizations = require("../db/models/organization_model");

module.exports = function (app) {
	app.post("/fetch_single_event", async (request, response) => {
		const { event_id } = request.body;

		if (!event_id || typeof event_id !== "string") {
			throw { code: 400, message: "Request body is missing critical fields or maintains invalid fields." };
		}

		try {
			const event = await Events.findOne({ _id: event_id }).populate("ticket_types");

			if (!event || !event._id) {
				throw { code: 502, message: `Failed to find events with the id ${event_id}` };
			}

			const { ticket_types } = event;
			let tix = [];

			for (let ticket of ticket_types) {
				if (ticket.seat_holds) {
					const { seat_holds } = ticket;
					const { num_seat_holds, seat_holds_release_type, seat_hold_release_ticket_type_id } = seat_holds;

					if (seat_holds_release_type === "timed") {
						const { seat_hold_release_time } = seat_holds;
						const now = new Date();

						if (now.getTime() <= new Date(seat_hold_release_time).getTime()) {
							ticket.number_of_tickets = ticket.number_of_tickets - num_seat_holds;
						}
					} else if (seat_holds_release_type === "ticket" && ticket_types.length > 1) {
						const idx = ticket_types.findIndex((curr_ticket) =>
							curr_ticket._id.equals(seat_hold_release_ticket_type_id)
						);

						const remaining_tix = ticket_types[idx].number_of_tickets;

						if (remaining_tix !== 0) {
							ticket.number_of_tickets = ticket.number_of_tickets - num_seat_holds;
						}
					} else if (seat_holds_release_type === "none") {
						ticket.number_of_tickets = ticket.number_of_tickets - num_seat_holds;
					}
				}

				if (new Date(ticket.release_time).getTime() <= new Date().getTime()) {
					tix.push(ticket);
				}
			}

			if (!tix.length) {
				throw { code: 502, message: `No tickets for event ${event_id} are ready or able to be released!` };
			}

			const org = await Organizations.findOne({
				_id: event.organization_id,
			});

			if (!org || !org._id) {
				throw { code: 502, message: `Failed to find organization associated with event ${event_id}.` };
			}

			return response.status(201).send({
				message: "Successfully fetched the event!",
				event,
				tix,
				org,
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
