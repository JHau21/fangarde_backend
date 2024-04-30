const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { String } acc_id
 * this function fetches an organization's bank accounts using their account ID
 * once the accounts are fetched, it checks to see if any accounts were found and
 * returns a corresponding value message
 */

async function retrieve_stripe_bank_accounts(acc_id) {
	// retrieve the entire stripe account instead of just the external accounts
	// do this so we can also get the payout information for the current account
	let stripe_conn_account;

	try {
		stripe_conn_account = await stripe.accounts.retrieve(acc_id);
	} catch (err) {
		return {
			payouts: {},
			bank_accounts: [],
			message: `No connect account found with id ${acc_id}`,
		};
	}

	if (!stripe_conn_account) {
		return {
			payouts: {},
			bank_accounts: [],
			message: `No connect account found with id ${acc_id}`,
		};
	}

	const { external_accounts, settings } = stripe_conn_account;

	if (external_accounts.length === 0) {
		return {
			payouts: {},
			bank_accounts: [],
			message: `No bank accounts associated with connected account of id ${acc_id}`,
		};
	}

	if (!settings) {
		return {
			payouts: {},
			bank_accounts: external_accounts,
			message: `No settings configured for connected account of id ${acc_id}`,
		};
	}

	const { payouts } = settings;
	const { data } = external_accounts;
	let bank_accounts = [];

	for (let i = 0; i < data.length; i++) {
		let bank_account = {
			id: data[i].id,
			bank_name: data[i].bank_name,
			account_type: data[i].account_type,
			last4: data[i].last4,
			default_for_currency: data[i].default_for_currency,
		};

		bank_accounts.push(bank_account);
	}

	return {
		payouts: payouts,
		bank_accounts: bank_accounts,
		message: "Successfully fetched bank accounts.",
	};
}

module.exports = function (app) {
	app.post("/retrieve_stripe_bank_accounts", (request, response) => {
		const { acc_id } = request.body;

		retrieve_stripe_bank_accounts(acc_id)
			.then(({ payouts, bank_accounts, message }) =>
				response.status(201).send({
					payload: {
						payouts,
						bank_accounts,
					},
					message: message,
				})
			)
			.catch((err) => {
				response.status(404).send({
					message: "Failed to fetch bank accounts.",
					error: err,
				});
			});
	});
};
