const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Organization = require("../db/models/organization_model");

/**
 * @param {{ line1: String, line2: String, city: String, state: String, country: String, postal_code: String }} address
 * @param { String } location_name
 * @returns { location_id: String }
 * Creates a new location to group Stripe terminal(s) to an organization
 */

module.exports = function (app) {
	app.post("/create_new_location", async (request, response) => {
		const { address, location_name, org_id } = request.body;

		try {
			if (
				!address ||
				Object(address).keys.length !== 6 ||
				!location_name ||
				typeof location_name !== "string" ||
				!org_id ||
				typeof org_id !== "string"
			) {
				throw { code: 400, message: "Request body is missing critical fields." };
			}

			const new_location = await stripe.terminal.locations.create({
				display_name: location_name,
				address: {
					...address,
				},
			});

			if (!new_location || !new_location.id) {
				throw { code: 500, message: "Failed to create new location." };
			}

			const updated_organization = await Organization.findByIdAndUpdate(org_id, {
				location_id: id,
			});

			if (!updated_organization) {
				throw {
					code: 500,
					message: `Failed to add location ID ${new_location.id} to organization.`,
				};
			}

			return response.status(201).send({
				location_id: id,
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
