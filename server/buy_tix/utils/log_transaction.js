const Transactions = require("../../db/models/transactions_model");

async function log_transaction(
	last_four_card_digits,
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
	charge_id,
	org_id,
	opted_in,
	transaction_type,
	transaction_fee,
	sale_location
) {
	const new_transaction = await Transactions.create({
		_id: transaction_id,
		organization_id: org_id,
		last_four_card_digits: last_four_card_digits,
		order: transaction_order,
		time: new Date(),
		consumer_cost: consumer_bill_rounded,
		actual_cost: consumer_bill_unrounded,
		unrounded_customer_profit: customer_profit_unrounded,
		rounded_customer_profit: customer_profit_rounded,
		first_name: first_name,
		last_name: last_name,
		email: email,
		donation_id: donation_id ?? undefined,
		opted_into_mailing_list: opted_in,
		charge_id: charge_id,
		transaction_type: transaction_type,
		transaction_fee: transaction_fee,
		sale_location: sale_location,
	});

	if (!new_transaction || !new_transaction._id) {
		throw { code: 502, message: "Failed to create and store new transaction document." };
	}

	return await Transactions.populate(new_transaction, { path: "order.ticket_type_id" });
}

module.exports = log_transaction;
