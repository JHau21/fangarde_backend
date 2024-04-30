const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Organization = require("../db/models/organization_model");

/**
 * @param { String } terminal_id
 * @param { String } label
 * @param { String } org_id
 * @returns { message: String }
 * Update the name of an existing terminal that's associated with a given organization
 */

module.exports = function (app) {
	app.post("/update_existing_terminal", async (request, response) => {
		const { terminal_id, org_id, label } = request.body;

		try {
			if (
				!terminal_id ||
				!org_id ||
				!label ||
				typeof terminal_id !== "string" ||
				typeof org_id !== "string" ||
				typeof label !== "string"
			) {
				throw { code: 400, message: "Request body is missing critical fields." };
			}

			const updated_terminal = await stripe.terminal.readers.update(terminal_id, { label: label });

			if (!updated_terminal || !updated_terminal.id) {
				throw {
					code: 500,
					message: `Failed to update terminal ${terminal_id} on Stripe's end with name ${label}.`,
				};
			}

			const update_response = await Organization.updateOne(
				{ _id: org_id, "terminals.terminal_id": terminal_id },
				{
					$set: {
						"terminals.$.name": label,
					},
				}
			);

			if (!update_response.acknowledged) {
				throw {
					code: 500,
					message: `Failed to update terminal ${terminal_id} within organization document with name ${label}.`,
				};
			}

			return response.status(201).send({
				message: "Successfully updated terminal!",
			});
		} catch (error) {
			if (error.code && error.message) {
				const { code, message } = error;

				console.log(message);

				return response.status(code).send({
					message: message,
				});
			} else {
				return response.status(500).send({
					error: error,
				});
			}
		}
	});
};
