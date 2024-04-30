//Not sure if I want to keep this file

//I combined the login into one API call that checks for user in both collections

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Mongoose models
const User = require("../db/models/user_model");

module.exports = function (app) {
	app.post("/login_user", (request, response) => {
		const email = request.body.email;
		User.findOne({
			email: { $regex: new RegExp("^" + email, "i") },
		})
			.then((user) => {
				bcrypt
					.compare(request.body.password, user.password)
					.then((passwordCheck) => {
						// check if password matches
						if (!passwordCheck) {
							return response.status(400).send({
								message: "Passwords do not match",
								error,
							});
						}
						//   create JWT token
						const token = jwt.sign(
							{
								userId: user._id,
								userEmail: user.email,
							},
							process.env.JWT_USER_AUTH_SECRET,
							{ expiresIn: "60d" }
						);
						//   return success response
						response.status(200).send({
							message: "Login Successful",
							user: user,
							token,
							type: "User",
						});
					})
					.catch((error) => {
						response.status(400).send({
							message: "Passwords do not match",
							error,
						});
					});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Email not found",
					e,
				});
			});
	});
};
