const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Organization = require("../db/models/organization_model");

/**
 * @param { String } registration_code
 * @param { String } label
 * @param { String } location_id
 * @param { String } org_id
 * @returns { new_terminal: Terminal }
 * Creates a new terminal object for an organization and an associated location group
 */

module.exports = function (app) {
	app.post("/create_new_terminal", async (request, response) => {
		const { registration_code, label, location_id, org_id } = request.body;

		try {
			if (
				!label ||
				!location_id ||
				!registration_code ||
				!org_id ||
				typeof label !== "string" ||
				typeof org_id !== "string" ||
				typeof registration_code !== "string" ||
				typeof location_id !== "string"
			) {
				throw { code: 400, message: "Request body is missing critical fields." };
			}

			const new_terminal = await stripe.terminal.readers.create({
				registration_code: registration_code,
				label: label,
				location: location_id,
			});

			if (!new_terminal || !new_terminal.id) {
				throw { code: 500, message: "Failed to create new terminal." };
			}

			const terminal = {
				name: label,
				terminal_id: new_terminal.id,
				registration_code: registration_code,
			};

			const updated_organization = await Organization.findByIdAndUpdate(org_id, {
				$push: {
					terminals: terminal,
				},
			});

			if (!updated_organization || !updated_organization._id) {
				throw {
					code: 500,
					message: `Failed to add new terminal ${new_terminal.id} to organization.`,
				};
			}

			return response.status(201).send({
				new_terminal: terminal,
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
