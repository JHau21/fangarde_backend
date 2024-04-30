const Transactions = require("../../../db/models/transactions_model");

const get_pdf_point_of_sale = require("../../../ticket_pdf/get_pdf_point_of_sale");

/**
 * @param { Transaction } transaction
 * @param { Event } event
 * @returns { transaction: Transaction }
 * @returns { ticket_pdf_stream: PDFData }
 * Using an inputted transaction, event_id, and org_id, fetch all relevant documents
 * Once the documents are fetched, all data is passed to an internal React method and component
 * Those components format and generate PDFs to be printed in the box office
 */

export const generate_tickets_pdf = async (transaction, event) => {
	const populated_transaction = await Transactions.populate(transaction, {
		path: "order.ticket_type_id",
	});

	if (!populated_transaction || !populated_transaction._id) {
		throw { code: 502, message: "Failed populate transaction with ticket documents." };
	}

	const pdf_ticket_stream = await get_pdf_point_of_sale(event, populated_transaction);

	if (!pdf_ticket_stream) {
		throw { code: 502, message: "Failed to generate ticket PDF." };
	}

	return { pdf_ticket_stream: pdf_ticket_stream };
};
