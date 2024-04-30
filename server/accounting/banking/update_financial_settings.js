const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Organzation = require("../../db/models/organization_model");

module.exports = function (app) {
	app.post("/update_financial_settings", (request, response) => {
		const { acc_id, new_payout_destination, payouts, statement_timing, org_id } = request.body;

		if (payouts && statement_timing) {
			// path for updating payouts and statement timing

			if (acc_id && org_id) {
				stripe.accounts
					.update(acc_id, {
						settings: {
							payouts: {
								debit_negative_balances: true,
								schedule: payouts.schedule,
								statement_descriptor: "FANGARDE INC PAYOUT",
							},
						},
					})
					.then((updated_conn_account) => {
						const { settings } = updated_conn_account;

						if (!settings) {
							response.status(500).send({
								financial_settings: undefined,
								payouts: undefined,
								payout_destination_updated: false,
								message: `No settings configured for connected account of id ${acc_id}`,
							});
						}

						return settings;
					})
					.then(async (settings) => {
						if (new_payout_destination) {
							const set_bank_account = await stripe.accounts.updateExternalAccount(
								acc_id,
								new_payout_destination,
								{
									default_for_currency: true,
								}
							);

							if (!set_bank_account) {
								response.status(500).send({
									financial_settings: undefined,
									payouts: undefined,
									payout_destination_updated: false,
									message: `Could not set bank account of id ${new_payout_destination}`,
								});
							}
						}
						return settings;
					})
					.then(async (settings) => {
						const { interval, email_address } = statement_timing;

						// uploaded statement timing stuff to organization
						const updated_org = await Organzation.findByIdAndUpdate(org_id, {
							financial_settings: {
								interval: interval,
								email_address: email_address,
							},
						});

						const { financial_settings } = updated_org;

						if (!financial_settings) {
							response.status(500).send({
								financial_settings: undefined,
								payouts: payouts,
								payout_destination_updated: false,
								message: "Failed to update financial statement timing",
							});
						}

						const { payouts } = settings;

						response.status(201).send({
							financial_settings: statement_timing,
							payouts: payouts,
							payout_destination_updated: false,
							message: "Successfully updated payout schedule and financial statement timing.",
						});
					})
					.catch((err) => {
						response.status(500).send({
							message: "Failed to add payout schedule or financial statement timing.",
							error: err,
						});
					});
			} else {
				response.status(500).send({
					message: "Failed to update payout schedule and statement timing. Missing stripe account ID or organization ID.",
				});
			}
		} else if (payouts) {
			// path for updating payouts

			if (acc_id) {
				stripe.accounts
					.update(acc_id, {
						settings: {
							payouts: {
								debit_negative_balances: true,
								schedule: payouts.schedule,
								statement_descriptor: "FANGARDE INC PAYOUT",
							},
						},
					})
					.then((updated_conn_account) => {
						const { settings } = updated_conn_account;

						if (!settings) {
							response.status(500).send({
								financial_settings: undefined,
								payouts: undefined,
								payout_destination_updated: false,
								message: `No settings configured for connected account of id ${acc_id}`,
							});
						}

						return settings;
					})
					.then(async (settings) => {
						if (new_payout_destination) {
							const set_bank_account = await stripe.accounts.updateExternalAccount(
								acc_id,
								new_payout_destination,
								{
									default_for_currency: true,
								}
							);

							if (!set_bank_account) {
								response.status(500).send({
									financial_settings: undefined,
									payouts: undefined,
									payout_destination_updated: false,
									message: `Could not set bank account of id ${new_payout_destination}`,
								});
							}
						}

						const { payouts } = settings;

						response.status(201).send({
							financial_settings: undefined,
							payouts: payouts,
							payout_destination_updated: false,
							message: "Successfully updated payout schedule.",
						});
					});
			} else {
				response.status(500).send({
					message: "Failed to update payout schedule and statement timing. Missing stripe account ID.",
				});
			}
		} else if (statement_timing) {
			// path for statement timing

			if (org_id) {
				const { interval, email_address } = statement_timing;

				Organzation.findByIdAndUpdate(org_id, {
					financial_settings: {
						interval: interval,
						email_address: email_address,
					},
				})
					.then((updated_org) => {
						const { financial_settings } = updated_org;

						if (!financial_settings) {
							response.status(500).send({
								financial_settings: undefined,
								payouts: undefined,
								payout_destination_updated: false,
								message: "Failed to update financial statement timing. Financial statement timing doesn't exist on organization.",
							});
						}

						response.status(201).send({
							financial_settings: statement_timing,
							payouts: undefined,
							payout_destination_updated: false,
							message: "Successfully updated financial statement timing.",
						});
					})
					.catch((err) => {
						response.status(500).send({
							message: "Failed to update financial statement timing.",
							error: err,
						});
					});
			} else {
				response.status(500).send({
					message: "Failed to update payout schedule and statement timing. Missing stripe organization ID.",
				});
			}
		} else if (acc_id && new_payout_destination) {
			if (acc_id) {
				if (new_payout_destination) {
					stripe.accounts
						.updateExternalAccount(acc_id, new_payout_destination, {
							default_for_currency: true,
						})
						.then((set_bank_account) => {
							if (!set_bank_account) {
								response.status(500).send({
									financial_settings: undefined,
									payouts: undefined,
									payout_destination_updated: false,
									message: `Could not set bank account of id ${new_payout_destination}`,
								});
							}

							response.status(201).send({
								financial_settings: undefined,
								payouts: undefined,
								payout_destination_updated: true,
								message: "Successfully updated payout destination",
							});
						});
				}
			} else {
				response.status(500).send({
					message: "Failed to update payout destination. Missing stripe account ID.",
				});
			}
		} else {
			response.status(500).send({
				message: "Failed to update payout schedule or statement timing. Invalid parameters.",
			});
		}
	});
};
