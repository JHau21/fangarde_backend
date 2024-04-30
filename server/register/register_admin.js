const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Mongoose Models
const Organization = require("../db/models/organization_model");
const Admin = require("../db/models/admin_model.js");

//Helper Function to create Admin Documents
async function createAdminUploads(admin, organization_id, person_ids) {
	let adminUpload;
	//adminHasPassword
	const admin_id = new mongoose.Types.ObjectId();
	await bcrypt
		.hash(admin.password, 10)
		.then((hashedPassword) => {
			adminUpload = new Admin({
				_id: admin_id,
				organization_id: organization_id,
				email: admin.email,
				password: hashedPassword,
				first_name: admin.first_name,
				last_name: admin.last_name,
				role: admin.role,
				stripe_rep_id: person_ids ? person_ids[0] : "",
				phone_number: admin.phone_number,
			});
		})
		.catch((e) => {
			response.status(500).send({
				message: "Password was not hashed successfully",
				e: JSON.stringify(e),
			});
		});
	return adminUpload;
}

module.exports = function (app) {
	app.post("/register_admin", (request, response) => {
		//Set vars
		const admin = request.body.admin;
		const organization = request.body.organization;
		const organization_id = new mongoose.Types.ObjectId();

		const { acc_id, person_ids } = request.body;

		//Loop through admins
		createAdminUploads(admin, organization_id, person_ids).then((adminUpload) => {
			const organizationUpload = new Organization({
				_id: organization_id,
				name: organization.name,
				description: organization.description,
				locations: organization.locations,
				admins: [adminUpload._id],
				number_events_annual: organization.number_events_annual,
				num_locations: organization.num_locations,
				num_attendee_per_event: organization.num_attendee_per_event,
				stripe_conn_id: acc_id ? acc_id : "",
				genre: organization.genre,
				financial_settings: {
					interval: "monthly",
					email_address: adminUpload.email,
				},
			});
			//Save objects
			organizationUpload
				.save()
				.then((organization_result) => {
					adminUpload
						.save()
						.then((admin_result) => {
							//   create JWT token
							const token = jwt.sign(
								{
									userId: admin_result._id,
									userEmail: admin_result.email,
									organizationId: organization_result._id,
								},
								process.env.JWT_ADMIN_AUTH_SECRET,
								{ expiresIn: "24h" }
							);
							organization_result.populate("admins").then((organization_result) => {
								response.status(200).send({
									message: "Admins and Organization created Successfully",
									user: admin_result,
									organization: organization_result,
									auth: token,
									error: false,
									type: "Admin",
								});
							});
						})
						.catch((err) => {
							Organization.findOneAndDelete({
								_id: organization_result._id,
							}).then(() => {
								response.status(500).send({
									message: "An error occurred, when creating your account. Please try again later.",
									error: true,
									err: JSON.stringify(err),
								});
							});
						});
				})
				.catch((err) => {
					response.status(500).send({
						message: "An error occurred, when creating your account. Please try again later.",
						error: true,
						err: JSON.stringify(err),
					});
					response.end();
				});
		});
	});
};
