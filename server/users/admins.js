const admin_auth = require("../auth/admin_auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
//Mongoose models
const Admin = require("../db/models/admin_model");
const User = require("../db/models/user_model");
const Organization = require("../db/models/organization_model");
const user_auth = require("../auth/user_auth");
const uploadImageToStorage = require("../firebase/upload_file");

module.exports = function (app) {
	app.post("/get_admins", admin_auth, (request, response) => {
		const { admins } = request.body;
		Admin.find({ _id: { $in: admins } })
			.then((admins) => {
				response.status(200).send({
					message: "Found admins!",
					admins: admins,
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
	app.post("/update_admins", admin_auth, (request, response) => {
		const { admins } = request.body;
		const { organizationId, userId } = request.user;

		let deleteRootAdmin = true;

		const operations = admins.map((admin) => {
			if (admin.role === "Root Admin") {
				deleteRootAdmin = false;
			}
			if (!admin._id) {
				admin._id = new mongoose.Types.ObjectId();
				admin.organization_id = organizationId;
			}
			const updateAdmin = {
				$set: { ...admin },
			};
			delete updateAdmin.$set._id;
			return {
				updateOne: {
					filter: { _id: admin._id },
					update: updateAdmin,
					upsert: true,
				},
			};
		});
		if (!deleteRootAdmin) {
			Admin.bulkWrite(operations)
				.then(() => {
					return Admin.find({ _id: { $in: admins.map((admin) => admin._id) } });
				})
				.then((updatedAdmins) => {
					Organization.findOneAndUpdate(
						{ _id: organizationId },
						{ $set: { admins: updatedAdmins.map((admin) => admin._id) } },
						{ new: true }
					)
						.populate("admins")
						.then((organization) => {
							response.status(200).send({
								message: "Updated admins!",
								admins: updatedAdmins,
								organization: organization,
								user: updatedAdmins.find((admin) => admin._id.toString() === userId.toString()),
							});
						})
						.catch((e) => {
							response.status(500).send({
								message: "An error occurred adding admins to organization.",
								error: true,
								e: JSON.stringify(e),
							});
						});
				})
				.catch((e) => {
					if (e.code === 11000 && e.writeErrors) {
						//Get the emails that were rejected
						const duplicateEmails = e.writeErrors
							.filter((err) => err.err && err.err.code === 11000) // Filter duplicate key errors
							.map((err) => {
								const match = err.err.errmsg.match(/dup key: { email: "(.+?)" }/); // Extract email using regex
								return match ? match[1] : null; // Return the email or null if not found
							})
							.filter((email) => email); // Remove any null values
						response.status(400).send({
							message: `These emails are already in use by an active account: ${duplicateEmails}.`,
							error: true,
							e: JSON.stringify(e),
						});
					} else {
						response.status(400).send({
							message: "An error occurred updating admins.",
							error: true,
							e: JSON.stringify(e),
						});
					}
				});
		} else {
			response.status(500).send({
				message: "You cannot delete root admin!",
				error: true,
			});
		}
	});
	app.post("/update_admin", admin_auth, async (request, response) => {
		const { user } = request.body;
		const { profile_picture } = user;
		delete user.password;

		// Upload images to Firebase Cloud Storage and get their URLs
		if (profile_picture.split(":")[0] === "data") {
			const profile_picture_url = await uploadImageToStorage(`admin_profile_pictures/${user._id}`, profile_picture);
			user.profile_picture = profile_picture_url;
		}

		Admin.findByIdAndUpdate(user._id, { $set: user }, { new: true })
			.then((updatedUser) => {
				response.status(200).send({
					message: "Updated Admin!",
					user: updatedUser,
				});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Admin not able to be updated!",
					error: true,
					e,
				});
			});
	});

	app.post("/update_admin_password", admin_auth, async (request, response) => {
		const { user } = request.body;
		await bcrypt
			.hash(user.password, 10)
			.then((hashedPassword) => {
				Admin.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } }, { new: true })
					.then((updatedUser) => {
						response.status(200).send({
							message: "Updated User!",
							user: updatedUser,
						});
					})
					.catch((e) => {
						response.status(404).send({
							message: "User not able to be updated!",
							error: true,
							e,
						});
					});
			})
			.catch((e) => {
				response.status(500).send({
					message: "Password was not hashed successfully",
					e,
				});
			});
	});

	app.post("/update_user", user_auth, async (request, response) => {
		const { user } = request.body;
		const { profile_picture } = user;

		delete user.password;
		// Upload images to Firebase Cloud Storage and get their URLs
		if (profile_picture) {
			const profile_picture_url = await uploadImageToStorage(`user_profile_pictures/${user._id}`, profile_picture);
			user.profile_picture = profile_picture_url;
		}

		User.findByIdAndUpdate(user._id, { $set: user }, { new: true })
			.then((updatedUser) => {
				response.status(200).send({
					message: "Updated Admin!",
					user: updatedUser,
				});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Admin not able to be updated!",
					error: true,
					e,
				});
			});
	});

	app.post("/update_user_password", user_auth, async (request, response) => {
		const { user } = request.body;
		await bcrypt
			.hash(user.password, 10)
			.then((hashedPassword) => {
				User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } }, { new: true })
					.then((updatedUser) => {
						response.status(200).send({
							message: "Updated User!",
							user: updatedUser,
						});
					})
					.catch((e) => {
						response.status(404).send({
							message: "User not able to be updated!",
							error: true,
							e,
						});
					});
			})
			.catch((e) => {
				response.status(500).send({
					message: "Password was not hashed successfully",
					e,
				});
			});
	});
};
