import { compute_bill_and_profit } from "../../utils/compute_bill_and_profit";
import { compute_order_totals } from "../../utils/compute_order_totals";

const log_transaction = require("../../utils/log_transaction");
const update_event = require("../../utils/update_event");

/**
 * @param { String } event_id
 * @param { String } org_id
 * @param { Order } order
 * @param { ObjectID } transaction_id
 * @return { transaction: Transaction }
 * @return { event: Event }
 * Once a consumer has paid with cash, store all of the transaction information
 */

module.exports = async function (event_id, org_id, order, transaction_id) {
	const sale_location = "at_the_door";
	const transaction_type = "cash";

	const { transaction_order, consumer_bill_unrounded, total_paid_tickets } = await compute_order_totals(
		event_id,
		transaction_id,
		order
	);

	if (!transaction_order.length || total_paid_tickets <= 0 || consumer_bill_unrounded <= 0) {
		throw {
			code: 500,
			message: "Failed to compute ticket quantity, consumer bill, or format the order.",
		};
	}

	const transaction_fee = 0;

	const { consumer_bill_rounded, customer_profit_rounded, customer_profit_unrounded } = await compute_bill_and_profit(
		consumer_bill_unrounded,
		transaction_fee,
		undefined,
		sale_location
	);

	const transaction = await log_transaction(
		"N/A",
		transaction_id,
		transaction_order,
		consumer_bill_rounded,
		consumer_bill_unrounded,
		customer_profit_rounded,
		customer_profit_unrounded,
		undefined,
		undefined,
		undefined,
		undefined,
		transaction_id,
		org_id,
		undefined,
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
		transaction: transaction,
		event: updated_event,
	};
};
