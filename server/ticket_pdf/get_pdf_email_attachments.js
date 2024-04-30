const { renderToStream, Document } = require("@react-pdf/renderer");
const SingleTicket = require("./jsx_files/single_ticket.jsx");
const React = require("react");

const getBufferFromStream = (stream) => {
	return new Promise((resolve, reject) => {
		const chunks = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", reject);
		stream.on("end", () => resolve(Buffer.concat(chunks)));
	});
};

const get_pdf_email_attachments = async (event, transaction, user_organization) => {
	const pdf_ticket_promises = transaction.order.flatMap((order, index) => {
		const ticket = order.ticket_type_id;
		const tickets = Array.from({ length: order.quantity }, (_, index) => index + 1);
		return tickets.map(async () => {
			const pdf_ticket_stream = await renderToStream(
				<Document>
					<SingleTicket
						event={event}
						transaction={transaction}
						user_organization={user_organization}
						ticket={ticket}
						ticket_tier={order.ticket_tier}
					/>
				</Document>
			);

			const pdfBuffer = await getBufferFromStream(pdf_ticket_stream);

			return {
				ContentType: "application/pdf",
				Name: `ticket_${index}.pdf`,
				Content: pdfBuffer.toString("base64"),
			};
		});
	});
	// Await all promises to resolve
	const pdf_attachments = await Promise.all(pdf_ticket_promises);
	return pdf_attachments;
};

module.exports = get_pdf_email_attachments;
