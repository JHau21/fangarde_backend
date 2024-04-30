import { compute_bill_and_profit } from "../../utils/compute_bill_and_profit";
import { compute_order_totals } from "../../utils/compute_order_totals";

const calculate_fee = require("../../utils/calculate_fee");

/**
 * @param { String } sale_location
 * @param { String } transaction_id
 * @param { String } event_id
 * @param { Order } order
 * @param { Donation } donation
 * @return { bill_amounts: BillAmounts }
 * @return { transaction_fee: Number }
 * @return { transaction_order: TransactionOrder }
 * Once a consumer has paid with cash, store all of the transaction information
 */

export const compute_donation_bill = async (sale_location, transaction_id, event_id, order, donation) => {
	const { transaction_order, consumer_bill_unrounded, total_paid_tickets } = await compute_order_totals(
		event_id,
		transaction_id,
		order
	);

	if (!transaction_order.length) {
		throw {
			code: 500,
			message: "Failed to format the order.",
		};
	}

	let donation_total = 0;

	const { amount, type } = donation;

	donation_total = amount;

	if (type === "percentage") {
		donation_total = consumer_bill_unrounded * (amount / 100);
	}

	const { service_fee, processing_fee } = calculate_fee(0, donation_total, total_paid_tickets, sale_location);

	const transaction_fee = service_fee + processing_fee;

	const { consumer_bill_rounded, customer_profit_rounded, customer_profit_unrounded } = await compute_bill_and_profit(
		consumer_bill_unrounded,
		transaction_fee,
		donation_total,
		sale_location
	);

	return {
		bill_amounts: {
			consumer_bill_unrounded: consumer_bill_unrounded + transaction_fee + donation_total,
			consumer_bill_rounded,
			customer_profit_rounded,
			customer_profit_unrounded,
		},
		transaction_fee: transaction_fee,
		transaction_order: transaction_order,
	};
};
