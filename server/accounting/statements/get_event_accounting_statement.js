const generate_accounting_statement = require("./generate_accounting_statement");

async function get_event_accounting_statement(app) {
	app.post("/get_event_accounting_statement", async (request, response) => {
		const { event_id } = request.body;

		try {
			const statement = await generate_accounting_statement("event", { event_id });

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
module.exports = get_event_accounting_statement;
