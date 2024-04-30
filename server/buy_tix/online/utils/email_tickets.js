const postmark = require("postmark");
const postmark_client = new postmark.ServerClient(process.env.POSTMARK_KEY);

const ticket_email = require("../email_and_svg_formats/ticket_email");
const get_pdf_email_attachments = require("../../../ticket_pdf/get_pdf_email_attachments");

async function email_tickets(email_address, orders, event, organization, total_price, custom_email_message, populated_transaction) {
	const { name, search_image } = event;
	const event_banner = event.banner;
	const { banner } = organization;

	if (process.env.SEND_EMAILS === "YES") {
		return await postmark_client.sendEmail({
			From: "contact@fangarde.com",
			To: email_address,
			Subject: `${name} Tickets`,
			HtmlBody: ticket_email(total_price, orders, custom_email_message, banner, search_image, event_banner), // don't open this file!
			MessageStream: "outbound",
			Attachments: await get_pdf_email_attachments(event, populated_transaction, organization),
		});
	} else {
		return;
	}
}

module.exports = email_tickets;
