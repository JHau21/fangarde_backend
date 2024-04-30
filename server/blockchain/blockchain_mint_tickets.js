const api = require("../axios/client");

async function mint_ticket(contract_address, abi) {
	const response = await api.post(
		"/mint_NFT",
		JSON.stringify({
			contract_address: contract_address,
			abi: abi,
		})
	);

	const { message } = response;

	return {
		message: message,
	};
}

module.exports = mint_ticket;
