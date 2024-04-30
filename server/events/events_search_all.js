const Event = require("../db/models/events_model");
const Organization = require("../db/models/organization_model");
const Ticket_Types = require("../db/models/ticket_type_model");

/**
 *
 * @param {String} name
 * @param {String} location
 * @param {String} genre
 * takes as input an object with specific search criteria; those criteria are listed below:
 * 	name - the main event keywords that are inputted to match a venue name or event name
 * 	location - the location search that will include address details
 * 	genre - an event genre from the enum of possible event genres
 * using the inputted query items, the function searches the entire collection
 * and pulls the first 15 events it finds matching the inputted query variables
 * the function then finds all of the associated organizations with the 15 events
 * Once the organizations are found, the function finally grabs the associated tickets
 * being sold for every event
 * returns an array of the events that it finds, an array of associated organizations,
 * and an array of associated tickets
 */

async function search_events(name, location, genre) {
	// In the future we'll want to make the search algorithm a bit more sophistocated
	// when I fetch the tickets I need to do some seat hold logic
	// if some seats are on hold for an event,
	// I need to subtract the number of seats on hold from the ticket type quantity value I send to the front end
	// if the hold conditions are not met
	// if the hold conditions are met, then I need to send the entire number of tickets to the frontend

	let query;

	if (name !== "") {
		query = {
			$or: [
				{
					name: {
						$regex: `.*${name.split("").join(".*")}.*`,
						$options: "i",
					},
				},
				{
					location: {
						$regex: `.*${name.split("").join(".*")}.*`,
						$options: "i",
					},
				},
			],
		};
	}

	if (location !== "") {
		query = {
			$and: [
				{ ...query },
				{
					$or: [
						{
							"address.city": {
								$regex: `.*${location.split("").join(".*")}.*`,
								$options: "i",
							},
						},
						{
							"address.zip": {
								$regex: `.*${location.split("").join(".*")}.*`,
								$options: "i",
							},
						},
					],
				},
			],
		};
	}

	if (genre !== "") {
		query = {
			$and: [
				{ ...query },
				{
					genre: {
						$regex: `.*${genre.split("").join(".*")}.*`,
						$options: "i",
					},
				},
			],
		};
	}

	const search_events = await Event.find({
		...query,
	})
		.where({ access_type: { $not: { $eq: "Private" } } })
		.populate("ticket_types"); // we should only allow public events to be searched

	if (search_events.length === 0) {
		return {
			events: [],
			orgs: [],
			tix: [],
		};
	}

	let unique_org_ids = [];

	for (let i = 0; i < search_events.length; i++) {
		if (!unique_org_ids.includes(search_events[i].organization_id)) {
			unique_org_ids.push(search_events[i].organization_id);
		}
	}

	let search_tix = [];

	for (const event of search_events) {
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
				} else if (seat_holds_release_type === "ticket") {
					// we might release tickets after another ticket type has
					// sold out or the current ticket type has sold out
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

			// only add tickets to be displayed if they've passed their release time
			if (new Date(ticket.release_time).getTime() <= new Date().getTime()) {
				search_tix.push(ticket);
			}
		}
	}

	const search_orgs = await Organization.find({
		_id: { $in: unique_org_ids },
	});

	if (search_orgs.length === 0) {
		return {
			events: search_events,
			orgs: [],
			tix: search_tix,
		};
	}

	return {
		events: search_events,
		orgs: search_orgs,
		tix: search_tix,
	};
}

module.exports = function (app) {
	app.post("/events_search_all", (request, response) => {
		const { query } = request.body;

		search_events(query.name, query.location, query.genre)
			.then(({ events, orgs, tix }) => {
				response.status(200).send({
					events: events,
					orgs: orgs,
					tix: tix,
					message: "Successfully fetched some matched events.",
				});
			})
			.catch((err) =>
				response.status(500).send({
					message: "Failed to find any matching events.",
					error: err,
				})
			);
	});
};
