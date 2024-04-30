const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { BillAmounts } bill_amounts
 * @param { StripeToken } stripe_token
 * @param { String } stripe_conn_id
 * @param { String } email
 * @return { charge: Charge | undefined }
 * Once a consumer has paid with cash, store all of the transaction information
 */

async function bill_user(bill_amounts, stripe_token, stripe_conn_id, email) {
	const { consumer_bill_rounded, customer_profit_rounded } = bill_amounts;
	const { id } = stripe_token;

	let consumer_bill_cents = (consumer_bill_rounded * 100).toFixed(0);
	let customer_profit_cents = (customer_profit_rounded * 100).toFixed(0);

	if (
		consumer_bill_cents > 49 &&
		consumer_bill_cents < 99999999 &&
		customer_profit_cents > 49 &&
		customer_profit_cents < 99999999
	) {
		const fangarde_stripe_app_fee = Number(consumer_bill_cents) - Number(customer_profit_cents);

		return await stripe.charges.create({
			amount: consumer_bill_cents, // total bill
			application_fee_amount: fangarde_stripe_app_fee, // our cut
			currency: "usd",
			source: id,
			description: "Fangarde INC. Tickets",
			statement_descriptor: "Fangarde INC.",
			statement_descriptor_suffix: "Fangarde INC.",
			receipt_email: email,
			transfer_data: {
				destination: stripe_conn_id,
			},
		});
	} else {
		throw {
			code: 400,
			message: "Consumer order contains purchased tickets that fall outside of valid Stripe billing range [$0.5 - $999,999.99].",
		};
	}
}

module.exports = bill_user;
