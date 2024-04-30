import { compute_bill_and_profit } from "../../utils/compute_bill_and_profit";
import { compute_order_totals } from "../../utils/compute_order_totals";

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const calculate_fee = require("../../utils/calculate_fee");
const log_transaction = require("../../utils/log_transaction");
const update_event = require("../../utils/update_event");

/**
 * @param { PaymentIntent } payment_intent
 * @returns { last_4_card_digits: String }
 * @returns { charge_id: String }
 * @returns { email: String | undefined }
 * @returns { first_name: String | undefined }
 * @returns { last_name: String | undefined }
 * Takes a processed and captured payment intent and retrieves important billing information
 */

const get_stripe_charge_info = (payment_intent) => {
	let last_4_card_digits, charge_id;

	const charge_data = payment_intent.charges.data;

	for (const charge of charge_data) {
		if (charge.status === "succeeded") {
			charge_id = charge.id;

			const { billing_details, payment_method_details } = charge;
			const { card_present } = payment_method_details;

			last_4_card_digits = card_present.last4;

			if (billing_details.name && billing_details.name.includes(" ")) {
				const name = billing_details.name.split(" ");

				return {
					last_4_card_digits,
					charge_id,
					email: billing_details.email,
					first_name: name[0],
					last_name: name[1],
				};
			}

			return {
				last_4_card_digits,
				charge_id,
				email: billing_details.email,
				first_name: undefined,
				last_name: undefined,
			};
		}
	}
};

/**
 * @param { String } event_id
 * @param { String } org_id
 * @param { Order } order
 * @param { String } payment_intent_id
 * @param { ObjectID } transaction_id
 * @return { transaction: Transaction }
 * @return { event: Event }
 * Once a card reader has authorized and processed a payment, store all of the transaction information
 */

module.exports = async function (event_id, org_id, order, payment_intent_id, transaction_id) {
	const sale_location = "at_the_door";
	const transaction_type = "card";

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

	const { service_fee, processing_fee } = await calculate_fee(
		parseFloat(consumer_bill_unrounded.toFixed(2)),
		0,
		total_paid_tickets,
		sale_location
	);

	const transaction_fee = service_fee + processing_fee;

	if (service_fee <= 0 || processing_fee <= 0) {
		throw { code: 500, message: "Failed to calculate fee." };
	}

	const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

	if (!payment_intent) {
		throw { code: 502, message: "Failed to retrieve payment intent." };
	}

	const { consumer_bill_rounded, customer_profit_rounded, customer_profit_unrounded } = await compute_bill_and_profit(
		consumer_bill_unrounded,
		transaction_fee,
		undefined,
		sale_location
	);

	const { last_4_card_digits, charge_id, email, first_name, last_name } = get_stripe_charge_info(payment_intent);

	if (!last_4_card_digits || !charge_id || typeof last_4_card_digits !== "string" || typeof charge_id !== "string") {
		throw { code: 500, message: "Failed to retrieve billing information from payment intent." };
	}

	const transaction = await log_transaction(
		last_4_card_digits,
		transaction_id,
		transaction_order,
		consumer_bill_rounded,
		consumer_bill_unrounded,
		customer_profit_rounded,
		customer_profit_unrounded,
		email,
		first_name,
		last_name,
		undefined, //donation_id is undefined
		charge_id,
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
