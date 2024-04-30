const log_transaction = require("../../utils/log_transaction");
const log_donation = require("../utils/log_donation");
const update_event = require("../../utils/update_event");

/**
 * @param { User } user
 * @param { String } sale_location
 * @param { String } event_id
 * @param { String } org_id
 * @param { TransactionOrder } trasaction_order
 * @param { Boolean } opted_in
 * @param { Charge } charge
 * @param { Donation | undefined } donation
 * @param { BillAmounts } bill_amounts
 * @param { Number } transaction_fee
 * @param { ObjectID } transaction_id
 * @return { event: Event }
 * @return { transaction: Transaction }
 * Once a consumer has paid with cash, store all of the transaction information
 */

module.exports = async function (
	sale_location,
	event_id,
	org_id,
	transaction_order,
	user,
	opted_in,
	charge,
	donation,
	bill_amounts,
	transaction_fee,
	transaction_id
) {
	const { first_name, last_name, email } = user;
	const { id, payment_method_details } = charge;
	const { last4 } = payment_method_details.card;
	const { consumer_bill_unrounded, consumer_bill_rounded, customer_profit_unrounded, customer_profit_rounded } = bill_amounts;

	const transaction_type = "card";

	if (!transaction_order.length) {
		throw {
			code: 500,
			message: "Failed to format the order.",
		};
	}

	let donation_id;

	if (donation) {
		donation_id = await log_donation(transaction_id, event_id, email, first_name, last_name, donation);

		if (!donation_id) {
			throw { code: 502, message: "Failed to store donation." };
		}
	}

	const transaction = await log_transaction(
		last4,
		transaction_id,
		transaction_order,
		consumer_bill_rounded,
		consumer_bill_unrounded,
		customer_profit_rounded,
		customer_profit_unrounded,
		email,
		first_name,
		last_name,
		donation_id,
		id,
		org_id,
		opted_in,
		transaction_type,
		transaction_fee,
		sale_location
	);

	if (!transaction || !transaction._id) {
		throw { code: 502, message: "Failed to create and store new transaction document." };
	}

	const updated_event = await update_event(event_id, transaction_id);

	if (!updated_event || !updated_event._id) {
		throw { code: 502, message: "Failed to update event with new transaction." };
	}

	return {
		event: updated_event,
		transaction: transaction,
	};
};
