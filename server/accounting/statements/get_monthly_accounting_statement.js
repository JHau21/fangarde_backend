const generate_accounting_statement = require("./generate_accounting_statement");

async function get_monthly_accounting_statement(app) {
	app.post("/get_monthly_accounting_statement", async (request, response) => {
		let { org_id, start_date, end_date } = request.body;

		if (typeof start_date === "string") {
			start_date = new Date(start_date);

			start_date.setHours(0);
			start_date.setMinutes(0);
			start_date.setSeconds(0);
		}

		if (typeof end_date === "string") {
			end_date = new Date(end_date);

			end_date.setHours(23);
			end_date.setMinutes(59);
			end_date.setSeconds(59);
		}

		try {
			const statement = await generate_accounting_statement("range", {
				org_id,
				start_date,
				end_date,
			});

			if (!statement.spreadsheet) {
				return response.status(400).send({
					error: statement.message,
				});
			}

			response.set("Content-Type", statement.spreadsheet.ContentType);
			response.set("Content-Disposition", `attachment; filename="${statement.spreadsheet.Name}"`);
			response.status(201).send({
				message: "Successfully generated the spreadsheet!",
				spreadsheet: {
					ContentType: statement.spreadsheet.ContentType,
					Name: statement.spreadsheet.Name,
					Content: statement.spreadsheet.Content,
				},
			});
		} catch (error) {
			response.status(500).send({
				error: error.message,
			});
		}
	});
}
module.exports = get_monthly_accounting_statement;
