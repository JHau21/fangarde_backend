const mongoose = require("mongoose");
const { Types } = mongoose;

import { compute_donation_bill } from "./bill_computation_methods/compute_donation_bill";
import { compute_paid_bill } from "./bill_computation_methods/compute_paid_bill";
import { store_free_transaction } from "./transaction_storage_methods/store_free_transaction";

const bill_user = require("./utils/bill_user");
const email_tickets = require("./utils/email_tickets");
const store_donation_transaction = require("./transaction_storage_methods/store_donation_transaction");
const store_paid_transaction = require("./transaction_storage_methods/store_paid_transaction");
const update_mailing_list = require("./utils/update_mailing_list");

module.exports = function (app) {
	app.post("/online_sale", async (request, response) => {
		const { order, organization, stripe_token, event, user, promo_code, donation, paid_tickets, opted_in } = request.body;

		try {
			if (
				!organization ||
				!event ||
				paid_tickets === undefined ||
				typeof paid_tickets !== "boolean" ||
				!organization._id ||
				!event._id
			) {
				throw {
					code: 400,
					message: "Request body contains invalid parameters or is missing critical fields.",
				};
			}

			const sale_location = "online";
			const event_id = event._id;
			const org_id = organization._id;

			const { stripe_conn_id, custom_email_message } = organization;

			const transaction_id = await new Types.ObjectId();

			if (!transaction_id || typeof transaction_id !== "object") {
				throw { code: 502, message: "Could not generate transaction ID." };
			}

			if (paid_tickets) {
				if (
					!stripe_token ||
					!stripe_token.id ||
					!order ||
					!user ||
					!stripe_conn_id ||
					order.length === 0 ||
					typeof opted_in !== "boolean" ||
					typeof stripe_conn_id !== "string"
				) {
					throw {
						code: 400,
						message: "Request body contains invalid parameters or is missing critical fields.",
					};
				}

				const { bill_amounts, transaction_fee, transaction_order } = await compute_paid_bill(
					sale_location,
					transaction_id,
					event_id,
					promo_code,
					order,
					donation
				);

				const charge = await bill_user(bill_amounts, stripe_token, stripe_conn_id, user.email);

				if (!charge || !charge.id) {
					throw { code: 502, message: "Failed to process bill on Stripe's end." };
				}

				const { event, transaction } = await store_paid_transaction(
					sale_location,
					event_id,
					org_id,
					transaction_order,
					user,
					opted_in,
					charge,
					donation,
					bill_amounts,
					transaction_fee,
					transaction_id
				);

				await update_mailing_list(organization._id, organization.mailing_list, user.email, opted_in);

				const postmark_doc = await email_tickets(
					user.email,
					transaction_order,
					event,
					organization,
					"FREE",
					custom_email_message,
					transaction
				);

				if (process.env.SEND_EMAILS === "YES" && !postmark_doc) {
					throw { code: 502, message: "Failed to email tickets to ticket-purchaser!" };
				}

				return response.status(201).send({
					message: "Successfully processed order!",
				});
			} else {
				if (donation) {
					if (
						!stripe_token ||
						!stripe_token.id ||
						!order ||
						!user ||
						!stripe_conn_id ||
						order.length === 0 ||
						typeof opted_in !== "boolean" ||
						typeof stripe_conn_id !== "string"
					) {
						throw {
							code: 400,
							message: "Request body contains invalid parameters or is missing critical fields.",
						};
					}

					const { bill_amounts, transaction_fee, transaction_order } = await compute_donation_bill(
						sale_location,
						transaction_id,
						event_id,
						order,
						donation
					);

					const charge = await bill_user(bill_amounts, stripe_token, stripe_conn_id, user.email);

					if (!charge || !charge.id) {
						throw { code: 502, message: "Failed to process bill on Stripe's end." };
					}

					const { event, transaction } = await store_donation_transaction(
						sale_location,
						event_id,
						org_id,
						transaction_order,
						user,
						opted_in,
						charge,
						donation,
						bill_amounts,
						transaction_fee,
						transaction_id
					);

					await update_mailing_list(organization._id, organization.mailing_list, user.email, opted_in);

					const postmark_doc = await email_tickets(
						user.email,
						transaction_order,
						event,
						organization,
						"FREE",
						custom_email_message,
						transaction
					);

					if (process.env.SEND_EMAILS === "YES" && !postmark_doc) {
						throw { code: 502, message: "Failed to email tickets to ticket-purchaser!" };
					}

					return response.status(201).send({
						message: "Successfully processed order!",
					});
				} else {
					if (!order || !user || order.length === 0 || typeof opted_in !== "boolean") {
						throw {
							code: 400,
							message: "Request body contains invalid parameters or is missing critical fields.",
						};
					}

					const { event, transaction_order, transaction } = await store_free_transaction(
						sale_location,
						event_id,
						org_id,
						order,
						user,
						opted_in,
						transaction_id
					);

					await update_mailing_list(organization._id, organization.mailing_list, user.email, opted_in);

					const postmark_doc = await email_tickets(
						user.email,
						transaction_order,
						event,
						organization,
						"FREE",
						custom_email_message,
						transaction
					);

					if (process.env.SEND_EMAILS === "YES" && !postmark_doc) {
						throw { code: 502, message: "Failed to email tickets to ticket-purchaser!" };
					}

					return response.status(201).send({
						message: "Successfully processed order!",
					});
				}
			}
		} catch (error) {
			console.log(error);
			if (error.code && error.message) {
				const { code, message } = error;

				console.log(message);

				return response.status(code).send({
					message: message,
				});
			} else {
				return response.status(500).send({
					error: error,
				});
			}
		}
	});
};
