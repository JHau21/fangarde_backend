const UpcomingEvents = require("../../db/models/events_model");
const PastEvents = require("../../db/models/past_events_model");

async function update_event(event_id, transaction_id) {
	const updated_upcoming_event = await UpcomingEvents.findByIdAndUpdate(event_id, {
		$push: { transactions: transaction_id },
	});

	if (updated_upcoming_event === null) {
		return await PastEvents.findByIdAndUpdate(event_id, {
			$push: { transactions: transaction_id },
		});
	} else {
		return updated_upcoming_event;
	}
}

module.exports = update_event;
