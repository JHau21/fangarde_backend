import get_pdf_stream from "./get_pdf_point_of_sale";
import Transaction from "../db/models/transactions_model";

function get_ticket_pdf(app) {
	app.post("/get_ticket_pdf", async (request, response) => {
		const { selected_option, transaction_id } = request.body;

		Transaction.findById(transaction_id)
			.populate({ path: "order.ticket_type_id" })
			.then((transaction) => {
				get_pdf_stream(selected_option, transaction)
					.then((pdf_stream) => {
						response.writeHead(200, {
							"Content-Type": "application/pdf",
							"Content-Disposition": "attachment; filename=ticket.pdf",
						});
						pdf_stream.pipe(response);
					})
					.catch((error) => {
						console.log(error);
						response.status(500).send({
							message: "Error generating ticket PDF!",
							error: JSON.stringify(error),
						});
					});
			})
			.catch((error) => {
				console.log(error);
				response.status(500).send({
					message: "Error fetching transaction!",
					error: JSON.stringify(error),
				});
			});
	});
}

module.exports = get_ticket_pdf;
