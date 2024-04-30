const Tickets = require("../../db/models/tickets_model");

// const mint_ticket = require("../blockchain/blockchain_mint_tickets");

async function create_tickets(order, transaction_id, event_id, user_id, contract_address, abi) {
	const { id, quantity } = order;
	let ticket_ids = [];

	for (let i = 0; i < quantity; i++) {
		const ticket = await Tickets.create({
			transaction_id: transaction_id,
			event_id: event_id,
			user_id: user_id,
			ticket_type: id,
		});
		//TODO: Commenting this out until we revisit
		// if(contract_address && abi){
		// 	await mint_ticket(contract_address, abi);
		// }

		ticket_ids.push(ticket.id);
	}

	return ticket_ids;
}

module.exports = create_tickets;
