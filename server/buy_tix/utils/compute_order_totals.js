const TicketTypes = require("../../db/models/ticket_type_model");

const create_tickets = require("./create_tickets");

/**
 * @param { String } event_id
 * @param { String } transaction_id
 * @param { Order } order
 * @returns { consumer_bill_unrounded: String }
 * @returns { total_paid_tickets: Number }
 * @returns { transaction_order: TransactionOrder }
 * Using an inputted order, this function computes the consumer bill, total number of purchased tickets, and formats transaction order
 */

export const compute_order_totals = async (event_id, transaction_id, order) => {
	let transaction_order = [];
	let consumer_bill_unrounded = 0;
	let total_paid_tickets = 0;
	let total_tickets = 0;

	for (const ticket_option of order) {
		const { ticket_type, sold } = ticket_option;
		const { number_of_tickets, ticket_name } = ticket_type;

		let new_quantity = number_of_tickets;

		if (!ticket_type || !ticket_type._id) {
			throw { code: 400, message: "Consumer order item is missing a ticket type!" };
		} else if (!sold || !sold.length) {
			throw { code: 400, message: "Consumer order item is missing sold field." };
		}

		for (const sold_item of sold) {
			const { ticket_tier, quantity } = sold_item;

			if (quantity > 0) {
				total_tickets += quantity;

				const price = ticket_tier.price;

				if (price < 0) {
					throw { code: 400, message: `Ticket price cannot be a negative value! Server received ${price}.` };
				} else {
					new_quantity -= quantity;

					if (new_quantity < 0) {
						throw { code: 400, message: "Cannot purchase more tickets than there are in stock!" };
					}

					await TicketTypes.where({
						_id: ticket_type._id,
					}).updateOne({
						number_of_tickets: new_quantity,
					});

					consumer_bill_unrounded += price * quantity;

					if (price > 0) {
						total_paid_tickets += quantity;
					}

					let new_ticket_ids = await create_tickets({ id: ticket_type._id, quantity }, transaction_id, event_id);

					transaction_order.push({
						ticket_name: ticket_name,
						ticket_tier: ticket_tier,
						ticket_type_id: ticket_type._id,
						ticket_ids: new_ticket_ids,
						quantity: quantity,
					});
				}
			} else if (quantity < 0) {
				throw { code: 400, message: `Sold quantity cannot be a negative value! Server received ${quantity}.` };
			}
		}
	}

	if (total_tickets === 0) {
		throw { code: 400, message: "The request body was sent without any selected tickets!" };
	}

	return {
		transaction_order,
		consumer_bill_unrounded,
		total_paid_tickets,
	};
};
