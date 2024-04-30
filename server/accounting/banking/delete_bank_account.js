const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @param { String } acc_id
 * @param { String } bank_acc_id
 * this function deletes an organization's bank account using their account ID and Bank Account ID
 * once the account is found, it's deleted and a corresponding message is returned
 * however, there is a large edge case which is handled here
 * if the bank account that the user attempts to delete is set to the default bank account for a specific currency
 * then a new bank account needs to be set as the default for that currency
 * this is handled by finding an alternative bank account for the only possible currency (usd),
 * then setting that alternate bank account as default and deleting the original default
 */

async function delete_stripe_bank_account(acc_id, bank_acc_id) {
	const external_account = await stripe.accounts.retrieveExternalAccount(
		acc_id,
		bank_acc_id
	);

	if (!external_account) {
		return {
			success: false,
			message: "Failed to find the selected bank account.",
		};
	}

	const { default_for_currency } = external_account;

	if (default_for_currency) {
		const external_accounts = await stripe.accounts.listExternalAccounts(
			acc_id,
			{
				object: "bank_account",
			}
		);

		if (external_accounts.length === 0) {
			return {
				success: false,
				message: "Failed to find any bank accounts.",
			};
		}

		let external_accounts_copy = new Array(external_accounts.data)[0];

		external_accounts_copy = external_accounts_copy.filter(
			(bank_account) => bank_account.id !== bank_acc_id
		);

		const new_default = external_accounts_copy[0];

		const updated_default = await stripe.accounts.updateExternalAccount(
			acc_id,
			new_default.id,
			{ default_for_currency: true }
		);

		if (!updated_default) {
			return {
				success: false,
				message: "Failed to set new default account.",
			};
		}
	}

	await stripe.accounts.deleteExternalAccount(acc_id, bank_acc_id);

	return {
		success: true,
		message: "Successfully deleted bank account.",
	};
}

module.exports = function (app) {
	app.post("/delete_stripe_bank_account", (request, response) => {
		const { acc_id, bank_acc_id } = request.body;

		delete_stripe_bank_account(acc_id, bank_acc_id)
			.then(({ success, message }) =>
				response.status(201).send({
					success: success,
					message: message,
				})
			)
			.catch((err) => {
				response.status(500).send({
					success: false,
					message: "Failed to delete the selected bank account.",
					error: err,
				});
			});
	});
};
