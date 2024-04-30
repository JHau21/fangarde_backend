const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//Mongoose models
const Admin = require("../db/models/admin_model");
const User = require("../db/models/user_model");
const Organization = require("../db/models/organization_model");
const admin_auth = require("../auth/admin_auth");
const user_auth = require("../auth/user_auth");

module.exports = function (app) {
	app.post("/login_admin", (request, response) => {
		const email = request.body.email;
		Admin.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } })
			.then((user) => {
				bcrypt
					.compare(request.body.password, user.password)
					.then((passwordCheck) => {
						// check if password matches
						if (!passwordCheck) {
							return response.status(400).send({
								message: "Incorrect Password!",
								error: true,
							});
						}
						//   create JWT token
						const token = jwt.sign(
							{
								userId: user._id,
								userEmail: user.email,
								organizationId: user.organization_id,
							},
							process.env.JWT_ADMIN_AUTH_SECRET,
							{ expiresIn: "60d" }
						);
						Organization.findOne({
							_id: mongoose.Types.ObjectId(user.organization_id),
						})
							.populate("admins")
							.then((organization) => {
								//   return success response
								response.status(200).send({
									message: "Login Successful",
									user: user,
									organization: organization,
									auth: token,
									type: "Admin",
								});
							})
							.catch((err) => {
								response.status(400).send({
									message: "Could not find organization",
									error: true,
									err,
								});
							});
					})
					.catch((e) => {
						response.status(400).send({
							message: "Incorrect Password!",
							error: true,
							e,
						});
					});
			})
			.catch((e) => {
				findUser(request, response);
			});
	});
	app.post("/fetch_account", user_auth, admin_auth, (request, response) => {
		const { user } = request;
		Admin.findOne({ email: user.userEmail })
			.then((admin) => {
				if (admin?.organization_id) {
					Organization.findOne({
						_id: mongoose.Types.ObjectId(admin.organization_id),
					})
						.populate("admins")
						.then((organization) => {
							response.status(200).send({
								message: "Fetch Account Successful",
								user: admin,
								organization: organization,
								type: "Admin",
							});
						})
						.catch((e) => {
							response.status(400).send({
								message: "Fetch Account Unsuccessful!",
								error: true,
								e,
							});
						});
				} else {
					User.findOne({ email: user.userEmail })
						.then((user) => {
							response.status(200).send({
								message: "Fetch Account Successful",
								user: user,
								type: "User",
							});
						})
						.catch((e) => {
							response.status(400).send({
								message: "Fetch Account Unsuccessful",
								error: true,
								e,
							});
						});
				}
			})
			.catch((e) => {
				User.findOne({ email: user.userEmail })
					.then((user) => {
						response.status(200).send({
							message: "Fetch Account Successful",
							user: user,
							type: "User",
							organizations,
						});
					})
					.catch((e) => {
						response.status(400).send({
							message: "Fetch Account Unsuccessful",
							error: true,
							e,
						});
					});
			});
	});
};

function findUser(request, response) {
	const email = request.body.email;
	User.findOne({ email: new RegExp("^" + email, "i") })
		.then((user) => {
			bcrypt
				.compare(request.body.password, user.password)
				.then((passwordCheck) => {
					// check if password matches
					if (!passwordCheck) {
						return response.status(400).send({
							message: "Incorrect Password!",
							error: true,
						});
					}
					//   create JWT token
					const token = jwt.sign(
						{
							userId: user._id,
							userEmail: user.email,
							organizationId: user.organization_id,
						},
						process.env.JWT_USER_AUTH_SECRET,
						{ expiresIn: "24h" }
					);
					//   return success response
					response.status(200).send({
						message: "Login Successful",
						user: user,
						auth: token,
						type: "User",
					});
				})
				.catch((e) => {
					response.status(400).send({
						message: "Incorrect Password!",
						error: true,
						e,
					});
				});
		})
		.catch((e) => {
			response.status(404).send({
				message: "Email not found, please create an account.",
				error: true,
				e,
			});
		});
}
