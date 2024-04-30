const admin_auth = require("../auth/admin_auth");
//Mongoose models
const Organization = require("../db/models/organization_model");
const uploadImageToStorage = require("../firebase/upload_file");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (app) {
	app.post("/update_organization", admin_auth, async (request, response) => {
		const { organization } = request.body;
		const { banner } = organization;
		if (banner) {
			if (banner.split(":")[0] === "data") {
				const banner_url = await uploadImageToStorage(`organization_banners/${organization._id}`, banner);
				organization.banner = banner_url;
			}
		}

		Organization.findByIdAndUpdate(organization._id, organization, {
			new: true,
		})
			.populate("admins")
			.then((organization) => {
				response.status(200).send({
					message: "Updated organization!",
					organization: organization,
				});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Admins not found!",
					error: true,
					e,
				});
			});
	});
	app.post("/save_location", admin_auth, async (request, response) => {
		const { user } = request;
		const { organizationId } = user;
		const { new_location, organization } = request.body;
		const { locations } = organization;
		const new_location_id = new ObjectId();
		let new_location_temp = { ...new_location };
		delete new_location_temp._id;
		let new_location_with_id = { _id: new_location_id, ...new_location_temp };
		const new_locations = [...locations, new_location_with_id];
		Organization.findByIdAndUpdate(
			organizationId,
			{ ...organization, locations: new_locations },
			{
				new: true,
			}
		)
			.populate("admins")
			.then((organization) => {
				response.status(201).send({
					message: "Saved Location!",
					organization: organization,
					new_location_id,
				});
			})
			.catch((e) => {
				response.status(502).send({
					message: "Unable to save location. Please try again later.",
					error: true,
					e,
				});
			});
	});

	app.post("/delete_location", admin_auth, async (request, response) => {
		const organizationId = request.user.organizationId;
		const { location_to_delete } = request.body;
		const _id_to_delete = location_to_delete._id;
		try {
			// Find the document by ID
			const organization = await Organization.findById(organizationId);

			if (!organization) {
				return response
					.status(502)
					.json({ error: "Unable to find organization. Try logging out and logging in again." });
			}

			// Find the index of the object with the specified ID in the array
			const indexToRemove = organization.locations.findIndex((obj) => obj._id == _id_to_delete);

			if (indexToRemove === -1) {
				return response.status(502).json({ error: "Unable to delete location. Please try again later." });
			}
			// Remove the object from the array
			organization.locations.splice(indexToRemove, 1);

			// Save the updated document
			const updatedOrganization = await organization.save();
			return response.status(200).json(updatedOrganization);
		} catch (err) {
			return response.status(500).json({ error: "Internal server error. Please try again later.", details: err.message });
		}
	});
};
