import { compute_order_totals } from "../../utils/compute_order_totals";

const mongoose = require("mongoose");
const { Types } = mongoose;

const log_transaction = require("../../utils/log_transaction");
const update_event = require("../../utils/update_event");

/**
 * @param { User } user
 * @param { String } sale_location
 * @param { String } event_id
 * @param { String } org_id
 * @param { Order } order
 * @param { Boolean } opted_in
 * @param { ObjectID } transaction_id
 * @return { event: Event }
 * @return { transaction_order: TransactionOrder }
 * @return { transaction: Transaction }
 * Once a consumer has paid with cash, store all of the transaction information
 */

export const store_free_transaction = async (sale_location, event_id, org_id, order, user, opted_in, transaction_id) => {
	const { first_name, last_name, email } = user;

	const transaction_type = "free";

	const { transaction_order } = await compute_order_totals(event_id, transaction_id, order);

	if (!transaction_order.length) {
		throw {
			code: 500,
			message: "Failed to format the order.",
		};
	}

	const transaction = await log_transaction(
		"N/A",
		transaction_id,
		transaction_order,
		0,
		0,
		0,
		0,
		email,
		first_name,
		last_name,
		undefined, //donation_id is undefined
		transaction_id,
		org_id,
		opted_in,
		transaction_type,
		0,
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
		transaction_order: transaction_order,
		transaction: transaction,
	};
};
