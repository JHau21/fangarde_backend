const Admin = require("../db/models/admin_model.js");

module.exports = function (app) {
	app.post("/admin_exists", (request, response) => {
		const email = request.body.email;

		Admin.countDocuments({ email }, function (err, count) {
			if (err) {
				response.status(500).send({
					message: "An error occurred please try again later.",
					err,
				});
			}
			if (count > 0) {
				response.status(201).send({
					message: "Admin exists",
					admin_exists: true,
				});
			} else {
				response.status(201).send({
					message: "Admin does not exist",
					admin_exists: false,
				});
			}
		});
	});
};
