const api = require("../axios/client");

async function generate_smart_contract(event_name, ticket_type_name, max_supply) {
	const response = await api.post(
		"/create_event_smart_contract",
		JSON.stringify({
			input_event_name: event_name,
			input_event_ticket_type: ticket_type_name,
			input_max_supply: max_supply,
		})
	);

	const { status } = response;

	if (status === 201) {
		const { data } = response;
		const { contract } = data;
		const { contract_address, abi, bytecode } = contract;

		return {
			contract_address: contract_address,
			abi: abi,
			bytecode: bytecode,
		};
	} else {
		return {
			contract_address: "N/A",
			abi: [],
			bytecode: "N/A",
		};
	}
}

module.exports = generate_smart_contract;
