const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { String } bank_acc_id
 * @param { String } acc_id
 * this function adds a customer's new bank account to their connected account
 * this is done simply by adding the bank account token to a connected account
 * by ID, then returning a corresponding success message
 */

async function add_bank_account(acc_id, bank_acc_id) {
	const bank_account = await stripe.accounts.createExternalAccount(acc_id, {
		external_account: bank_acc_id,
	});

	if (!bank_account.id) {
		return {
			added: false,
			message: "Failed to add bank account to Stripe connected account.",
		};
	}

	return {
		added: true,
		message: "Successfilly added bank account to Stripe connected account.",
	};
}

module.exports = function (app) {
	app.post("/add_new_bank_account", (request, response) => {
		const { acc_id, bank_acc_id } = request.body;

		add_bank_account(acc_id, bank_acc_id)
			.then(({ added, message }) =>
				// we need to send back the account id to add to the org document and representative id to add to the admin document
				response.status(201).send({
					added: added,
					message: message,
				})
			)
			.catch((err) => {
				response.status(500).send({
					added: added,
					message: "Failed to add bank account to Stripe connected account.",
					error: err,
				});
			});
	});
};
