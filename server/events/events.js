const UpcomingEvents = require("../db/models/events_model");
const admin_auth = require("../auth/admin_auth");
const PastEvents = require("../db/models/past_events_model");
const Transactions = require("../db/models/transactions_model");
const TicketTypes = require("../db/models/ticket_type_model");
const mongoose = require("mongoose");

module.exports = function (app) {
	app.post("/get_all_organization_events", admin_auth, (request, response) => {
		const { user } = request;
		UpcomingEvents.find({ organization_id: user.organizationId })
			.populate("ticket_types") // Populate the 'ticket_types' field
			.sort({ event_start_time: -1 })
			.then((upcoming_events) => {
				PastEvents.find({ organization_id: user.organizationId })
					.populate("ticket_types") // Populate the 'ticket_types' field
					.sort({ event_start_time: -1 })
					.then((past_events) => {
						response.status(200).send({
							message: "Found events!",
							past_events: past_events,
							upcoming_events: upcoming_events,
						});
					})
					.catch((e) => {
						response.status(404).send({
							message: "Events not found!",
							error: true,
							e,
						});
					});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Events not found!",
					error: true,
					e: JSON.stringify(e),
				});
			});
	});

	app.post("/search_events", admin_auth, (request, response) => {
		// In the future we'll want to make the search algorithm a bit more sophistocated
		const { user } = request;
		const { filters, order, collection } = request.body;
		let query = {
			organization_id: new mongoose.Types.ObjectId(user.organizationId),
		};
		if (filters.name !== "") {
			query = {
				$and: [
					{ ...query },
					{
						name: {
							$regex: `.*${filters.name.split("").join(".*")}.*`,
							$options: "i",
						},
					},
				],
			};
		}
		if (filters.start_time !== undefined) {
			query = {
				$and: [{ ...query }, { event_start_time: { $gte: filters.start_time } }],
			};
		}
		// Should be event end time in future, right now there is no end time for users to enter
		if (filters.end_time !== undefined) {
			query = {
				$and: [{ ...query }, { event_start_time: { $lte: filters.end_time } }],
			};
		}
		if (filters.location !== "") {
			query = {
				$and: [
					{ ...query },
					{
						location: {
							$regex: `.*${filters.location.split("").join(".*")}.*`,
							$options: "i",
						},
					},
				],
			};
		}
		if (filters.genre !== "None") {
			query = {
				$and: [
					{ ...query },
					{
						genre: filters.genre,
					},
				],
			};
		}
		if (collection === "upcoming_events") {
			UpcomingEvents.aggregate([
				{
					$match: { ...query },
				},
				{
					$lookup: {
						from: "transactions",
						localField: "transaction_ids",
						foreignField: "_id",
						as: "transactions",
					},
				},
				{
					$lookup: {
						from: "ticket_types",
						localField: "ticket_types", // Refer to ticket_type_id within the order object
						foreignField: "_id",
						as: "ticket_types",
					},
				},
				{
					$sort: { event_start_time: order },
				},
			])

				.then((events) => {
					response.status(200).send({
						message: "Found events!",
						events: events,
					});
				})
				.catch((e) => {
					response.status(404).send({
						message: "Events not found!",
						error: true,
						e,
					});
				});
		} else {
			PastEvents.aggregate([
				{
					$match: { ...query },
				},
				{
					$lookup: {
						from: "transactions",
						localField: "transaction_ids",
						foreignField: "_id",
						as: "transactions",
					},
				},
				{
					$lookup: {
						from: "ticket_types",
						localField: "ticket_types", // Refer to ticket_type_id within the order object
						foreignField: "_id",
						as: "ticket_types",
					},
				},
				{
					$sort: { event_start_time: order },
				},
			])
				.then((events) => {
					response.status(200).send({
						message: "Found events!",
						events: events,
					});
				})
				.catch((e) => {
					response.status(404).send({
						message: "Events not found!",
						error: true,
						e,
					});
				});
		}
	});
	app.post("/update_event", admin_auth, (request, response) => {
		const { user, body } = request;
		const { event } = body;
		UpcomingEvents.findOneAndUpdate({ _id: event._id }, { ...event }, { new: true })
			.then((updated_event) => {
				response.status(200).send({
					message: "Updated event!",
					updated_event: updated_event,
				});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Event not updated!",
					error: true,
					e,
				});
			});
	});

	app.post("/get_transactions", admin_auth, (request, response) => {
		const { user, body } = request;
		const { transaction_ids } = body;
		const new_ids = transaction_ids.map((transaction) => new mongoose.Types.ObjectId(transaction));
		Transactions.aggregate([
			{
				$match: {
					_id: {
						$in: new_ids,
					},
				},
			},
			{
				$lookup: {
					from: "ticket_types",
					localField: "ticket_ids",
					foreignField: "_id",
					as: "ticket_types",
				},
			},
		])
			.then((transactions) => {
				response.status(200).send({
					message: "Found transactions!",
					transactions: transactions,
				});
			})
			.catch((e) => {
				response.status(404).send({
					message: "Transactions not found!",
					error: true,
					e,
				});
			});
	});
};
