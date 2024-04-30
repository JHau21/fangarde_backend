const { Document, renderToStream } = require("@react-pdf/renderer");
const SingleTicket = require("./jsx_files/single_ticket.jsx");
const React = require("react");
const TransactionReceipt = require("./jsx_files/ticket_receipt.jsx");

const get_pdf_stream = async (event, transaction) => {
	const RenderTickets = () => {
		return transaction.order.flatMap((order, index) => {
			const ticket = order.ticket_type_id;
			const tickets = Array.from({ length: order.quantity }, (_, index) => index + 1);
			return tickets.map(() => {
				return (
					<SingleTicket
						key={index}
						event={event}
						transaction={transaction}
						ticket={ticket}
						ticket_tier={order.ticket_tier}
					/>
				);
			});
		});
	};
	const RenderReceipt = () => {
		return <TransactionReceipt event={event} transaction={transaction} />;
	};

	const pdf_string = renderToStream(
		<Document>
			<RenderTickets />
			<RenderReceipt />
		</Document>
	);

	return pdf_string;
};

module.exports = get_pdf_stream;
