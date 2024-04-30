const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Organization = require("../db/models/organization_model");

/**
 * @param { String } org_id
 * @param { String } terminal_id
 * @returns { message: String }
 * Deletes an existing terminal that's associated with a given organization
 */

module.exports = function (app) {
	app.post("/delete_existing_terminal", async (request, response) => {
		const { terminal_id, org_id } = request.body;

		try {
			if (!terminal_id || !org_id || typeof terminal_id !== "string" || typeof org_id !== "string") {
				throw { code: 400, message: "Request body is missing critical fields." };
			}

			const deleted_terminal = await stripe.terminal.readers.del(terminal_id);

			if (!deleted_terminal || !deleted_terminal.id) {
				throw { code: 500, message: "Failed to delete terminal on Stripe's end." };
			}

			const updated_organization = await Organization.findByIdAndUpdate(org_id, {
				$pull: {
					terminals: { terminal_id: terminal_id },
				},
			});

			if (!updated_organization || !updated_organization._id) {
				throw {
					code: 500,
					message: `Failed to remove terminal ${terminal_id} from organization document.`,
				};
			}

			return response.status(201).send({
				message: "Successfully removed terminal!",
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
