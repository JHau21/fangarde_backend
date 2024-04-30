import { generate_tickets_pdf } from "./utils/generate_ticket_pdfs";

const mongoose = require("mongoose");
const { Types } = mongoose;

const store_card_transaction = require("./transaction_storage_methods/store_card_transaction");
const store_cash_transaction = require("./transaction_storage_methods/store_cash_transaction");
const store_free_transaction = require("./transaction_storage_methods/store_free_transaction");

module.exports = function (app) {
	app.post("/box_office_sale", async (request, response) => {
		const { transaction_type } = request.body;

		try {
			const transaction_id = await new Types.ObjectId();

			if (!transaction_id || typeof transaction_id !== "object") {
				throw { code: 502, message: "Could not generate transaction ID." };
			}

			switch (transaction_type) {
				case "card": {
					const { event_id, org_id, order, payment_intent_id } = request.body;

					if (
						!event_id ||
						!org_id ||
						!order ||
						!payment_intent_id ||
						typeof event_id !== "string" ||
						typeof org_id !== "string" ||
						!order.length ||
						typeof payment_intent_id !== "string"
					) {
						throw {
							code: 400,
							message: "Request body is missing critical values or contains type errors.",
						};
					}

					const { transaction, event } = await store_card_transaction(
						event_id,
						org_id,
						order,
						payment_intent_id,
						transaction_id
					);

					const { pdf_ticket_stream } = await generate_tickets_pdf(transaction, event);

					response.status(201);
					response.setHeader("Content-Type", "application/pdf");
					response.setHeader("Content-Disposition", "inline; filename=document.pdf");

					return pdf_ticket_stream.pipe(response);
				}
				case "cash": {
					const { event_id, org_id, order } = request.body;

					if (
						!event_id ||
						!org_id ||
						!order ||
						typeof event_id !== "string" ||
						typeof org_id !== "string" ||
						!order.length
					) {
						throw {
							code: 400,
							message: "Request body is missing critical values or contains type errors.",
						};
					}

					const { transaction, event } = await store_cash_transaction(event_id, org_id, order, transaction_id);

					const { pdf_ticket_stream } = await generate_tickets_pdf(transaction, event);

					response.status(201);
					response.setHeader("Content-Type", "application/pdf");
					response.setHeader("Content-Disposition", "inline; filename=document.pdf");

					return pdf_ticket_stream.pipe(response);
				}
				case "free": {
					const { event_id, org_id, order } = request.body;

					if (
						!event_id ||
						!org_id ||
						!order ||
						typeof event_id !== "string" ||
						typeof org_id !== "string" ||
						!order.length
					) {
						throw {
							code: 400,
							message: "Request body is missing critical values or contains type errors.",
						};
					}

					const { transaction, event } = await store_free_transaction(event_id, org_id, order, transaction_id);

					const { pdf_ticket_stream } = await generate_tickets_pdf(transaction, event);

					response.status(201);
					response.setHeader("Content-Type", "application/pdf");
					response.setHeader("Content-Disposition", "inline; filename=document.pdf");

					return pdf_ticket_stream.pipe(response);
				}
				default: {
					throw { code: 400, message: "No valid transaction type passed to transaction handler." };
				}
			}
		} catch (error) {
			if (error.code && error.message) {
				const { code, message } = error;

				console.log(message);

				return response.status(code).send({
					message: message,
				});
			} else {
				return response.status(500).send({
					error: error,
				});
			}
		}
	});
};
