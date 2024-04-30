const Events = require("../db/models/events_model");
const Organizations = require("../db/models/organization_model");

/**
 * takes no input
 * searched the entire event collection and pulls the first 15 events it finds
 * the function then finds all of the associated organizations with the 15 events
 * Once the organizations are found, the function finally grabs the associated tickets
 * being sold for every event
 * returns an array of the events that it finds, an array of associated organizations,
 * and an array of associated tickets
 */

async function fetch_events() {
	const init_events = await Events.find({})
		.limit(15)
		.where({ access_type: { $not: { $eq: "Private" } } })
		.populate("ticket_types");

	if (init_events.length === 0) {
		return {
			events: [],
			orgs: [],
			tix: [],
		};
	}

	let unique_org_ids = [];

	for (let i = 0; i < init_events.length; i++) {
		if (!unique_org_ids.includes(init_events[i].organization_id)) {
			unique_org_ids.push(init_events[i].organization_id);
		}
	}

	let init_tix = [];

	for (const event of init_events) {
		const { ticket_types } = event;

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
				init_tix.push(ticket);
			}
		}
	}

	const init_orgs = await Organizations.find({
		_id: { $in: unique_org_ids },
	});

	if (init_orgs.length === 0) {
		return {
			events: init_events,
			orgs: [],
			tix: init_tix,
		};
	}

	return {
		events: init_events,
		orgs: init_orgs,
		tix: init_tix,
	};
}

module.exports = function (app) {
	app.get("/events_fetch_init", (request, response) => {
		fetch_events()
			.then(({ events, orgs, tix }) => {
				if (events.length === 0) {
					response.status(404).send({
						events: events,
						orgs: orgs,
						tix: tix,
						message: "No events found.",
					});
				} else {
					response.status(200).send({
						events: events,
						orgs: orgs,
						tix: tix,
						message: "Successfully fetch some inital events.",
					});
				}
			})
			.catch((err) => {
				response.status(500).send({
					message: "Failed to fetch some inital events.",
					error: err,
				});
			});
	});
};
