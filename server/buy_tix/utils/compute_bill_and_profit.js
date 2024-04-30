/**
 * @param { Number } consumer_bill_unrounded
 * @param { Number } transaction_fee
 * @param { Number | undefined } donation_total
 * @returns { consumer_bill_rounded: Number }
 * @returns { customer_profit_rounded: Number }
 * @returns { customer_profit_unrounded: Number }
 * Using the current consumer bill unrounded and fees, calculate the customer's profit and the consumer's bill
 */

export const compute_bill_and_profit = (consumer_bill_unrounded, transaction_fee, donation_total, sale_location) => {
	if (sale_location === "online") {
		if (donation_total && donation_total > 0) {
			const customer_profit_rounded =
				parseFloat(consumer_bill_unrounded.toFixed(2)) + parseFloat(donation_total.toFixed(2));
			const customer_profit_unrounded = consumer_bill_unrounded + donation_total;
			const consumer_bill_rounded =
				parseFloat(consumer_bill_unrounded.toFixed(2)) +
				parseFloat(transaction_fee.toFixed(2)) +
				parseFloat(donation_total.toFixed(2));

			return {
				customer_profit_rounded,
				customer_profit_unrounded,
				consumer_bill_rounded,
			};
		} else {
			const customer_profit_rounded = consumer_bill_unrounded;
			const customer_profit_unrounded = consumer_bill_unrounded;
			const consumer_bill_rounded = parseFloat(consumer_bill_unrounded.toFixed(2)) + parseFloat(transaction_fee.toFixed(2));

			return {
				consumer_bill_rounded: consumer_bill_rounded,
				customer_profit_rounded: parseFloat(customer_profit_rounded.toFixed(2)),
				customer_profit_unrounded: customer_profit_unrounded,
			};
		}
	} else {
		const customer_profit_rounded = consumer_bill_unrounded - transaction_fee;
		const customer_profit_unrounded = consumer_bill_unrounded - transaction_fee;
		const consumer_bill_rounded = parseFloat(consumer_bill_unrounded.toFixed(2));

		return {
			consumer_bill_rounded: consumer_bill_rounded,
			customer_profit_rounded: parseFloat(customer_profit_rounded.toFixed(2)),
			customer_profit_unrounded: customer_profit_unrounded,
		};
	}
};
