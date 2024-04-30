const ContactFormInfo = require("../db/models/contact_form_model");

const postmark = require("postmark");
const postmark_client = new postmark.ServerClient(process.env.POSTMARK_KEY);

module.exports = function (app) {
	app.post("/contact_form", (request, response) => {
		const { first_name, last_name, email, message, ip } = request.body;

		if (!first_name || !last_name || !email || !message || !ip) {
			response.status(400).send({
				message: "Request body is missing critical fields.",
			});

			throw new Error("Request body is missing critical fields.");
		}

		ContactFormInfo.aggregate([
			{ $match: { $or: [{ ip: ip }, { email: email }] } },
			{
				$addFields: {
					date_difference: {
						$abs: {
							$subtract: [new Date(), "$time"],
						},
					},
				},
			},
			{
				$sort: {
					date_difference: 1,
				},
			},
			{
				$limit: 1,
			},
		])
			.then((submission) => {
				if (submission.length) {
					const last_submission_time = new Date(submission[0].time);
					const current_time = new Date();
					const time_difference_in_ms = current_time - last_submission_time;
					const time_difference_in_hours = time_difference_in_ms / (1000 * 60 * 60);

					if (time_difference_in_hours < 1) {
						throw new Error("You can only submit the contact form once every hour.");
					}
				}
			})
			.then(async () => {
				if (process.env.SEND_EMAILS === "YES") {
					await postmark_client.sendEmail({
						From: "contact@fangarde.com",
						To: "contact@fangarde.com",
						Subject: "New Contact Form Submission",
						TextBody: `
						Name: ${first_name} ${last_name}
						Email: ${email}
						Question/Concern: ${message}
					`,
						MessageStream: "outbound",
					});
				}
			})
			.then(() =>
				ContactFormInfo.create({
					first_name,
					last_name,
					email,
					message,
					ip,
					time: new Date().toISOString(),
				})
			)
			.then(() =>
				response.status(200).send({
					message: "Contact form information successfully submitted and email sent",
					repeat_submission: false,
				})
			)
			.catch((error) => {
				if (error.message === "You can only submit the contact form once every hour.") {
					response.status(200).send({
						message: error.message,
						repeat_submission: true,
					});
				} else {
					response.status(500).send({
						message: "Internal server error.",
						error: error,
					});
				}
			});
	});
};
