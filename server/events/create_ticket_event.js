const Event = require("../db/models/events_model.js");
const Organzation = require("../db/models/organization_model");
const TicketType = require("../db/models/ticket_type_model");
const mongoose = require("mongoose");
const { Types } = mongoose;
const admin_auth = require("../auth/admin_auth");
const uploadImageToStorage = require("../firebase/upload_file");

const generate_smart_contract = require("../blockchain/blockchain_generate_smart_contract.js");

/*
The old code was not working, so I rewrote it to continue even if smart contract fails
I added a false to the contract and contract abi, they are no longer required
This is not an adequate fix, but it will allow us to continue working on the project
without having to worry about the smart contract failing
The old code that worked is commented out below
 */

module.exports = function (app) {
	app.post("/create_ticket_event", admin_auth, async (request, response) => {
		const { user } = request;
		const { organizationId } = user;
		const event_id = new Types.ObjectId();
		const { event, ticket_types } = request.body;
		const { banner, search_image } = event;

		try {
			let can_create_paid_events = true;

			Organzation.findOne({ _id: organizationId }, async (err, org) => {
				if (err) {
					return response.status(404).send({
						message: "Failed to find organization.",
						error: err,
					});
				} else if (!org) {
					return response.status(404).send({
						message: "Organization not found.",
					});
				} else if (!org.stripe_conn_id) {
					can_create_paid_events = false;
				}
			});

			const new_ticket_types = ticket_types.map(async (ticket_type, index) => {
				// TODO : Blockchain is too much of a hassle to integrate right now and we do not need it for current use cases.
				// TODO: We are commenting all of the blockchain logic out for now
				// //TODO: Remove this when the smart contract is fixed
				// let contract_address, abi, bytecode;
				// let contractError;
				// //To be removed
				// // This is a temporary fix for the smart contract failing
				// try {
				// 	const contractData = await generate_smart_contract(
				// 		event.name,
				// 		ticket_type.ticket_name,
				// 		ticket_type.number_of_tickets
				// 	);

				// 	contract_address = contractData.contract_address;
				// 	abi = contractData.abi;
				// 	bytecode = contractData.bytecode;
				// } catch (err) {
				// 	console.error("Error generating smart contract:", err);
				// 	contractError = err;
				// }

				const new_ticket_type = await TicketType.create({
					...ticket_type,
					price: can_create_paid_events ? ticket_type.price : 0,
					// contract_address: contract_address,
					// abi: abi,
					// bytecode: bytecode,
					event_id: event_id,
					// contract_error: contractError && contractError.message, // Store the error message if there is an error
				});
				event.ticket_types[index] = new_ticket_type._id;
				return new_ticket_type;
			});

			const result = await Promise.all(new_ticket_types);

			// Upload images to Firebase Cloud Storage and get their URLs
			let temp_new_event = {
				_id: event_id,
				...event,
				organization_id: user.organizationId,
			};

			let bannerUrl = "",
				searchImageUrl = "";
			if (banner) {
				bannerUrl = await uploadImageToStorage(`banners/${temp_new_event._id}`, banner);
				temp_new_event.banner = bannerUrl;
			}
			if (search_image) {
				searchImageUrl = await uploadImageToStorage(`search_images/${temp_new_event._id}`, search_image);
				temp_new_event.search_image = searchImageUrl;
			}

			const new_event = await Event.create(temp_new_event);

			response.status(201).send({
				message: "Event Created Successfully!",
				result: { new_event, new_ticket_types: result },
				error: false,
			});
		} catch (err) {
			try {
				const ticket_type_ids = ticket_types;

				await TicketType.deleteMany({ _id: { $in: ticket_type_ids } });
			} catch (deleteError) {
				console.error("Failed to delete ticket types after event creation failure:", deleteError);
			}

			return response.status(500).json({
				message: "An error occurred, when creating your event. Please try again later.",
				error: true,
				err: JSON.stringify(err),
			});
		}
	});
};
