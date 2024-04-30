const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { String } owner_token
 * @param { String } rep_token
 * @param { String } acc_id
 * this function creates the necessary identity users associated with a connected stripe account
 * this is done by taking in a few parameters with the user information, company structure, and identity image documents
 * depending on the company structure, an owner and representative are created or an exclusive representative is created
 * for the representatives that are created, we need to upload identity documents
 * therefore, the function also calls helper functions to create Stripe uploaded files with identity information
 * once the users are created, the function verifies their sucessful creation and return a corresponding success message
 */

async function add_customer_persona(owner_token, rep_token, acc_id) {
	let new_users = [];

	const rep = await stripe.accounts.createPerson(acc_id, {
		person_token: rep_token,
	});

	new_users.push(rep.id);

	// flow for multi rep orgs.
	if (owner_token) {
		const owner = await stripe.accounts.createPerson(acc_id, {
			person_token: owner_token,
		});

		new_users.push(owner.id);
	}

	return { acc_id, new_users };
}

/**
 *
 * @param { String } organization_token
 * @param { { mcc: String, url: String } } remaining_org_info
 * this function create a stripe customer account with corresponding admins for the account
 * it takes in tokens representing the customer account information and files to verify the identity of attached stripe account owners
 * first, using the inputted tokens, stripe create a connected account
 * second, given the tokens representing the stripe connected account admins, it calls create_customer_persona to generate the admins
 * finally, it checks for errors and returns success information
 */

async function create_customer_stripe_account(organization_token, remaining_org_info) {
	const account_type = "custom"; // given the nature of our platform, we will only create custom accounts
	const currency = "usd";

	const { mcc, url } = remaining_org_info;

	// create the connected account
	const conn_account = await stripe.accounts.create({
		account_token: organization_token,
		business_profile: {
			mcc: mcc,
			url: url,
		},
		capabilities: {
			card_payments: { requested: true },
			transfers: { requested: true },
		},
		default_currency: currency,
		type: account_type,
		settings: {
			payouts: {
				debit_negative_balances: true, // this is really important to set to true...
			},
		},
	});

	const acc_id = conn_account.id;

	return { acc_id };
}

module.exports = function (app) {
	app.post("/create_customer_stripe_account", (request, response) => {
		const { organization_token, rep_token, owner_token, remaining_org_info } = request.body;

		create_customer_stripe_account(organization_token, remaining_org_info)
			.then(({ acc_id }) => add_customer_persona(owner_token, rep_token, acc_id))
			.then(({ acc_id, new_users }) =>
				// we need to send back the account id to add to the org document and representative id to add to the admin document
				response.status(201).send({
					payload: {
						acc_id: acc_id,
						person_ids: new_users,
					},
					message: "Stripe connected account created successfully.",
				})
			)
			.catch((err) => {
				response.status(500).send({
					message: "Failed to create Stripe connected account.",
					error: err,
				});
			});
	});
};
