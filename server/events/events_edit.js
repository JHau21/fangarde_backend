const Event = require("../db/models/events_model");

/**
 *
 * @param {Request = { id: ObjectID, update_criteria: SubEvent }} request
 * @param {Response} response
 * takes an id, to find the desired event to update and the update criteria. The format of the update criteria is explained below:
 * 	the update_criteria will depend on what's actually being updated
 * 	no matter the criteria, however, it is spread in the updateOne method
 * 	therefore, the update_criteria needs to exactly match the document structure in property names and types, as listed in /server/db/models/upcoming_events_model
 * 	this DOES NOT mean that all event properties need to be included, only those which are being updated
 * finds the correct event by id and updates the altered information
 * returns that newly updated event object
 */

async function edit_event(request, response) {
	try {
		const edited = await Event.where({ _id: request.id }).updateOne({
			...request.update_criteria,
		});

		response.json(edited);
	} catch (err) {
		response.json({ error: err });
	}
}

module.exports = edit_event;
