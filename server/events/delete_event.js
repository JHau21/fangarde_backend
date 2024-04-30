const Event = require("../db/models/events_model");

/**
 *
 * @param {Request = { id: ObjectID }} request
 * @param {Response} response
 * takes as input an Event _id
 * finds and deletes the event matching _id
 * returns an object with deletion details
 */

async function delete_event(request, response) {
	// eventually this function will need some complicated image stuff
	// but it's too hard to implement for right now...

	try {
		const deleted = await Event.deleteOne({
			_id: request,
		});

		response.json(deleted);
	} catch (err) {
		response.json({ error: err });
	}
}

module.exports = delete_event;
