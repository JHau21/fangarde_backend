const Organizations = require("../../db/models/organization_model");

const postmark = require("postmark");
const postmark_client = new postmark.ServerClient(process.env.POSTMARK_KEY);

const accounting_email = require("../accounting_email/accounting_email_body");
const generate_accounting_statement = require("./generate_accounting_statement");

const format_date = async (date) => {
	return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
};

function format_interval(interval) {
	return interval.charAt(0).toUpperCase() + interval.slice(1).toLowerCase();
}

function get_last_day_of_month(year, month) {
	const date = new Date(year, month + 1, 0);

	return date.getDate();
}

module.exports = function () {
	let locked = false;

	// run forever and ever and ever and ever and ever and ever and ever and ever and ever
	setInterval(async () => {
		// to prevent race conditions from executing this multiple times
		if (!locked) {
			locked = true;

			const now = new Date();

			const hours = now.getHours();
			const minutes = now.getMinutes();
			const seconds = now.getSeconds();

			// if now is 12:00:00 AM, then we need to figure out which statements we have to send out...
			if (hours === 0 && minutes === 0 && seconds === 0) {
				const day = now.getDay();
				const year = now.getFullYear();
				const month = now.getMonth();
				const date = now.getDate();

				let query_options = [];

				// send out all weekly scheduled statements on Monday
				if (day === 1) {
					query_options.push("weekly");
				}

				// send out all last day of the month scheduled statements
				if (date === get_last_day_of_month(year, month)) {
					query_options.push("monthly");
				}

				// send out all last day of the year scheduled statements
				if (month + 1 === 12 && date === get_last_day_of_month(year, month)) {
					query_options.push("yearly");
				}

				const matching_orgs = await Organizations.find({
					$and: [{ "financial_settings.interval": { $in: query_options } }, { stripe_conn_id: { $exists: true } }],
				});

				if (matching_orgs.length > 0) {
					for (const org of matching_orgs) {
						const { _id, financial_settings, stripe_conn_id } = org;

						if (stripe_conn_id) {
							const { interval, email_address } = financial_settings;
							let first_day;
							let last_day;

							if (interval === "weekly") {
								first_day = new Date(now.setDate(now.getDate() - now.getDay())); // date of Sunday
								last_day = new Date(now.setDate(now.getDate() + 6)); // date of Saturday
							} else if (interval === "monthly") {
								first_day = new Date(now.getFullYear(), now.getMonth(), 1); // date of first of the month
								last_day = new Date(now.getFullYear(), now.getMonth() + 1, 0); // date of last of the month
							} else if (interval === "yearly") {
								first_day = new Date(now.getFullYear(), 0, 1); // date of first of the year
								last_day = new Date(now.getFullYear(), 11, 31); // date of last of the year
							}

							// establish promise that needs to be resolved before sending another statement
							await new Promise((resolve) => {
								generate_accounting_statement("range", {
									org_id: _id,
									start_date: first_day,
									end_date: last_day,
								})
									.then(async ({ spreadsheet, message }) => {
										if (spreadsheet && message === "Successfully generated the spreadsheet!") {
											if (process.env.SEND_EMAILS === "YES") {
												await postmark_client.sendEmail({
													From: "contact@fangarde.com",
													To: email_address,
													Subject: `${format_interval(interval)} Accounting Statement`,
													HtmlBody: accounting_email(
														await format_date(first_day),
														await format_date(last_day)
													), // don't open this function! Or do... idgaf
													MessageStream: "outbound",
													Attachments: [spreadsheet],
												});
											}
										}
									})
									.then(() => {
										setTimeout(() => {
											resolve();
										}, 1000);
									});
							});
						}
					}
				}
			}

			locked = false;
		}
	}, 1000); // every 1 second, we'll execute the callback function and check if the time is midnight
};
