const Donations = require("../../../db/models/donations_model");

async function log_donation(transaction_id, event_id, email, first_name, last_name, donation) {
	if (donation) {
		const { type, amount } = donation;

		const response = await Donations.create({
			transaction_id: transaction_id,
			event_id: event_id,
			first_name: first_name,
			last_name: last_name,
			email: email,
			donation_type: type,
			donation_amount: amount,
		});

		return response._id;
	} else {
		return undefined;
	}
}

module.exports = log_donation;
