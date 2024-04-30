const User = require("../db/models/user_model.js");

module.exports = function (app) {
	app.post("/user_exists", (request, response) => {
		const email = request.body.email;

		User.countDocuments({ email: email }, function (err, count) {
			if (err) {
				response.status(500).send({
					message: "An error occurred please try again later.",
					err,
				});
			}
			if (count > 0) {
				response.status(201).send({
					message: "User exists",
					user_exists: true,
				});
			} else {
				response.status(201).send({
					message: "User does not exist",
					user_exists: false,
				});
			}
		});
	});
};
