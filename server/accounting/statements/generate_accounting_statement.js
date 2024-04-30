const Donations = require("../../db/models/donations_model");
const UpcomingEvents = require("../../db/models/events_model");
const PastEvents = require("../../db/models/past_events_model");
const Transactions = require("../../db/models/transactions_model");

const excel_js = require("exceljs");
const fs = require("fs");
const mongoose = require("mongoose");
const { Types } = mongoose;

const calculate_donation_dollar_amount = (customer_profit_unrounded, donation_amount, donation_type) => {
	let additional_cost = 0;

	// percentage donations make me want to die
	if (donation_type === "percentage") {
		if (customer_profit_unrounded > 0) {
			additional_cost = Number(customer_profit_unrounded * (donation_amount / 100));
		} else {
			additional_cost = Number(0 * (donation_amount / 100));
		}
	} else if (donation_type === "flat") {
		additional_cost = Number(donation_amount);
	}

	return Number(additional_cost.toFixed(2));
};

const check_parameters = (type, params) => {
	if (type && typeof type === "string") {
		switch (type) {
			case "event": {
				const { event_id } = params;

				return event_id && (typeof event_id === "object" || typeof event_id === "string");
			}
			case "range": {
				const { org_id, start_date, end_date } = params;

				return (
					org_id &&
					(typeof org_id === "object" || typeof org_id === "string") &&
					start_date &&
					typeof start_date === "object" &&
					start_date instanceof Date &&
					end_date &&
					typeof end_date === "object" &&
					end_date instanceof Date &&
					start_date < end_date &&
					start_date !== end_date
				);
			}
			default: {
				return false;
			}
		}
	} else {
		return false;
	}
};

const fetch_transactions = async (type, params) => {
	if (type === "event") {
		const { event_id } = params;
		let transactions = [];

		const upcoming_event = await UpcomingEvents.findOne({
			_id: event_id,
		}).populate({
			path: "transactions",
			populate: {
				path: "order.ticket_type_id",
			},
		});
		const past_event = await PastEvents.findOne({
			_id: event_id,
		}).populate({
			path: "transactions",
			populate: {
				path: "order.ticket_type_id",
			},
		});

		if (upcoming_event) transactions = upcoming_event.transactions;
		else if (past_event) transactions = past_event.transactions;

		return transactions;
	} else if (type === "range") {
		const { org_id, start_date, end_date } = params;

		return Transactions.find(
			{
				organization_id: org_id,
				time: {
					$gte: start_date.toISOString(),
					$lte: end_date.toISOString(),
				},
				consumer_cost: { $gte: 0 },
				actual_cost: { $gte: 0 },
			},
			{ organization_id: 0 }
		).populate({
			path: "order.ticket_type_id",
		});
	} else {
		return [];
	}
};

const format_date_time = async (date) => {
	return (
		date.getMonth() +
		1 +
		"/" +
		date.getDate() +
		"/" +
		date.getFullYear() +
		"-" +
		date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
	);
};

const format_order = async (order, transaction_type) => {
	let order_summary = "";
	let iteration = 0;
	let volume = {
		paid: 0,
		free: 0,
	};
	let cost = 0;

	for (const order_item of order) {
		const { quantity, ticket_name, ticket_tier } = order_item;

		const { price } = ticket_tier;

		if (iteration > 0 && iteration < order.length) {
			order_summary += " | ";
		}

		order_summary += quantity + "x " + ticket_name + " - " + ticket_tier.name;
		iteration += 1;

		if (transaction_type !== "free") {
			cost += quantity * price;
		}

		if (price > 0 && transaction_type !== "free") {
			volume.paid += quantity;
		} else {
			volume.free += quantity;
		}
	}

	return {
		order_summary,
		volume,
		cost,
	};
};

const populate_summary = async (summary_tab, data) => {
	const { digital_sales, door_sales, refunds, donations } = data;

	const headers = ["Item", "Volume", "Value"];

	// base header
	summary_tab.addRow(["Gross Sales Summary"]);
	summary_tab.addRow({});

	// digital sales section
	summary_tab.addRow(["Web"]);
	summary_tab.addRow(headers);
	summary_tab.addRow(["Credit/Debit Card:", digital_sales.ticket_volume_card, digital_sales.ticket_sales_card]);
	summary_tab.addRow(["In Kind:", digital_sales.ticket_volume_free, 0]);

	const total_digital_sales = digital_sales.ticket_sales_card;
	const total_digital_volume = digital_sales.ticket_volume_card + digital_sales.ticket_volume_free;
	const total_digital_sales_after_fee = total_digital_sales - digital_sales.fee_loss;

	summary_tab.addRow(["Total - Before Fees:", total_digital_volume, total_digital_sales]);
	summary_tab.addRow(["Fees:", digital_sales.fee_volume, digital_sales.fee_loss]);
	summary_tab.addRow(["Total - After Fees:", total_digital_volume, total_digital_sales_after_fee]);

	summary_tab.addRow({});

	//at-the-door sales section
	summary_tab.addRow(["Box Office"]);
	summary_tab.addRow(headers);
	summary_tab.addRow(["Credit/Debit Card:", door_sales.ticket_volume_card, door_sales.ticket_sales_card]);
	summary_tab.addRow(["Cash:", door_sales.ticket_volume_cash, door_sales.ticket_sales_cash]);
	summary_tab.addRow(["In Kind:", door_sales.ticket_volume_free, 0]);

	const total_door_sales = door_sales.ticket_sales_card + door_sales.ticket_sales_cash;
	const total_door_volume = door_sales.ticket_volume_card + door_sales.ticket_volume_cash + door_sales.ticket_volume_free;
	const total_door_sales_after_fee = total_door_sales - door_sales.fee_loss;

	summary_tab.addRow(["Total - Before Fees:", total_door_volume, total_door_sales]);
	summary_tab.addRow(["Fees:", door_sales.fee_volume, door_sales.fee_loss]);
	summary_tab.addRow(["Total - After Fees:", total_door_volume, total_door_sales_after_fee]);

	summary_tab.addRow({});

	//refunds section
	summary_tab.addRow(["Refunds"]);
	summary_tab.addRow(headers);
	summary_tab.addRow(["Refunds:", refunds.refund_volume, refunds.refund_loss]);

	const total_volume_before_refunds = total_digital_volume + total_door_volume;
	const total_volume_after_refunds = total_volume_before_refunds - refunds.refund_volume;
	const total_sales_before_refunds = total_digital_sales_after_fee + total_door_sales_after_fee;
	const total_sales_after_refunds = total_sales_before_refunds - refunds.refund_loss;

	summary_tab.addRow(["Total - Before Refunds:", total_volume_before_refunds, total_sales_before_refunds]);
	summary_tab.addRow(["Total - After Refunds:", total_volume_after_refunds, total_sales_after_refunds]);

	summary_tab.addRow({});

	// donations section
	summary_tab.addRow(["Donations"]);
	summary_tab.addRow(headers);
	summary_tab.addRow(["Donations:", donations.donation_volume, donations.donation_sales]);

	const total_sales_after_donations = total_sales_after_refunds + donations.donation_sales;

	summary_tab.addRow(["Total - Before Donations:", total_volume_after_refunds, total_sales_after_refunds]);
	summary_tab.addRow([
		"Total - After Donations:",
		total_volume_after_refunds, // donations volume won't impact overall ticket volume
		total_sales_after_donations,
	]);

	summary_tab.addRow({});
	summary_tab.addRow(["Total Payout"]);
	summary_tab.addRow(headers);
	summary_tab.addRow(["Payout Amount", total_volume_after_refunds, total_sales_after_donations]);

	// the positions on the sheet are hardcoded so, given our current design, this is precisely where we need to bold/grow text
	const bold_medium_rows = [
		summary_tab.getRow(4),
		summary_tab.getRow(12),
		summary_tab.getRow(21),
		summary_tab.getRow(27),
		summary_tab.getRow(33),
	];
	const large_cells = [
		summary_tab.getCell("A1"),
		summary_tab.getCell("A3"),
		summary_tab.getCell("A11"),
		summary_tab.getCell("A20"),
		summary_tab.getCell("A26"),
		summary_tab.getCell("A32"),
	];

	// make all relevant header rows bold
	bold_medium_rows.forEach((bold_row) => bold_row.eachCell((cell) => (cell.font = { bold: true, size: 12 })));

	// make item column bold
	summary_tab.getColumn("C").eachCell({ includeEmpty: false }, (cell) => (cell.numFmt = '"$"#,##0.00_);("$"#,##0.00)'));

	// make cells larger
	large_cells.forEach((cell) => (cell.font = { size: 16 }));
};

const populate_transactions = async (transactions_tab, data) => {
	const headers = [
		"Transaction ID",
		"Ticket Order",
		"Last Four Card Digits",
		"Transaction Date",
		"Unrounded Profit",
		"Rounded Profit",
		"First Name",
		"Last Name",
		"Email",
		"Donation",
		"Donation Amount",
		"Refunded",
	];

	transactions_tab.addRow(["All Transactions"]);
	transactions_tab.addRow({});
	transactions_tab.addRow(headers);

	transactions_tab.getCell("A1").font = { bold: true, size: 16 };

	transactions_tab.getRow(3).eachCell((cell) => (cell.font = { bold: true, size: 12 }));

	data.forEach((transaction_row) => transactions_tab.addRow(transaction_row));

	const dollar_columns = [transactions_tab.getColumn("E"), transactions_tab.getColumn("F"), transactions_tab.getColumn("K")];

	dollar_columns.forEach((dollar_column) =>
		dollar_column.eachCell({ includeEmpty: false }, (cell) => {
			cell.numFmt = '"$"#,##0.00_);("$"#,##0.00)';
		})
	);
};

const generate_spreadsheet = async (transactions, spreadsheet_path) => {
	const workbook = new excel_js.Workbook();

	const summary_tab = workbook.addWorksheet("Aggregate Summary");
	const transactions_tab = workbook.addWorksheet("Transactions List");

	// aggregate summary for spreadsheet
	let agg_summary = {
		digital_sales: {
			ticket_volume_card: 0,
			ticket_sales_card: 0,
			ticket_volume_free: 0,
			fee_volume: 0,
			fee_loss: 0, // this will always be 0 for now
		},
		door_sales: {
			ticket_volume_card: 0,
			ticket_sales_card: 0,
			ticket_volume_cash: 0,
			ticket_sales_cash: 0,
			ticket_volume_free: 0,
			fee_volume: 0,
			fee_loss: 0,
		},
		refunds: {
			refund_volume: 0,
			refund_loss: 0, // this will always be 0 for now
		},
		donations: {
			donation_volume: 0,
			donation_sales: 0,
		},
	};

	let transactions_list = [];

	for (const transaction of transactions) {
		const {
			donation_id,
			_id,
			order,
			last_four_card_digits,
			time,
			unrounded_customer_profit, // the donation amount is included in this
			rounded_customer_profit, // the donation amount is included in this
			first_name,
			last_name,
			email,
			refunded,
			transaction_fee,
			transaction_type,
			sale_location,
		} = transaction;

		const { volume, order_summary, cost } = await format_order(order, transaction_type);

		let transaction_item = {
			_id: _id,
			order: order_summary,
			last_four_card_digits: last_four_card_digits,
			time: await format_date_time(new Date(time)),
			unrounded_customer_profit: Number(unrounded_customer_profit.toFixed(2)),
			rounded_customer_profit: Number(rounded_customer_profit.toFixed(2)),
			first_name: first_name ?? "N/A",
			last_name: last_name ?? "N/A",
			email: email ?? "N/A",
			donation: "No",
			donation_amount: 0,
			refunded: refunded ? "Yes" : "No",
		};
		let ticket_sales = cost;

		if (donation_id) {
			const donation = await Donations.findOne({
				_id: donation_id,
			});

			const { donation_amount, donation_type } = donation;

			const donation_dollar_amount = calculate_donation_dollar_amount(cost, donation_amount, donation_type);

			transaction_item.donation = "Yes";
			transaction_item.donation_amount = donation_dollar_amount;

			agg_summary.donations.donation_volume += 1;
			agg_summary.donations.donation_sales += donation_dollar_amount;
		}

		if (refunded) {
			agg_summary.refunds.refund_volume += volume.paid;
			agg_summary.refunds.refund_loss += sale_location === "at_the_door" ? ticket_sales - transaction_fee : ticket_sales; // for now, this will always be 0
		}

		if (sale_location === "at_the_door") {
			agg_summary.door_sales.ticket_volume_free += volume.free;
			agg_summary.door_sales.fee_loss += transaction_fee;

			if (transaction_type === "card") {
				agg_summary.door_sales.ticket_volume_card += volume.paid;
				agg_summary.door_sales.ticket_sales_card += ticket_sales;
				agg_summary.door_sales.fee_volume += 1;
			} else if (transaction_type === "cash") {
				agg_summary.door_sales.ticket_volume_cash += volume.paid;
				agg_summary.door_sales.ticket_sales_cash += ticket_sales;
				agg_summary.door_sales.fee_volume += 1;
			}
		} else if (sale_location === "online") {
			agg_summary.digital_sales.ticket_volume_card += volume.paid;
			agg_summary.digital_sales.ticket_sales_card += ticket_sales;
			agg_summary.digital_sales.ticket_volume_free += volume.free;
			agg_summary.digital_sales.fee_volume += 1;
		}

		transactions_list.push(Object.values(transaction_item));
	}

	await populate_transactions(transactions_tab, transactions_list);
	await populate_summary(summary_tab, agg_summary);
	await workbook.xlsx.writeFile(spreadsheet_path);

	return;
};

/**
 *
 * @param {Enum: ["event", "range"]} type
 * @param {{ org_id: ObjectID, start_date: Date, end_date: Date } | { event_id: ObjectID }} params
 * @returns {{ spreadsheet: { ContentType: String, Name: String, Content: Base64 } | undefined, message: String }}
 * this function takes in a type, "event" or "range" which specifies the type of accounting spreadsheet
 * the function also takes in an objcet called "params", which includes the required data to generate the spreadsheet
 * params can be an object with an "event_id" or an object with "org_id", "start_date", and "end_date".
 * once the function is called, it fetches all the Transactions and generates a corresponding spreadsheet
 * the function returns a spreadsheet attachment to include in a PostMark API call and a message
 */

module.exports = function (type, params) {
	const spreadsheet_name = "accounting_summary_statement.xlsx";
	const spreadsheet_identifier = new Types.ObjectId(); // this identifier is important for preventing duplicate files from being created
	const spreadsheet_path = `./server/accounting/statements/temp_spreadsheets/transactions_spreadsheet_${spreadsheet_identifier}.xlsx`;

	if (check_parameters(type, params)) {
		return fetch_transactions(type, params)
			.then(async (transactions) => {
				if (transactions.length) {
					await generate_spreadsheet(transactions, spreadsheet_path);

					const spreadsheet_file = await fs.readFileSync(spreadsheet_path);
					const spreadsheet_base_64 = await Buffer.from(spreadsheet_file).toString("base64");

					const spreadsheet = {
						ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						Name: spreadsheet_name,
						Content: spreadsheet_base_64,
					};

					await fs.unlinkSync(spreadsheet_path);

					return {
						spreadsheet: spreadsheet,
						message: "Successfully generated the spreadsheet!",
					};
				} else {
					return {
						spreadsheet: undefined,
						message: "Could not generate spreadsheet. No transactions could be found!",
					};
				}
			})
			.catch((error) => {
				return {
					spreadsheet: undefined,
					message: `Could not generate spreadsheet. Failed with error message ${error}`,
				};
			});
	} else {
		return {
			spreadsheet: undefined,
			message: "Could not generate spreadsheet. Incorrect parameters or parameter types.",
		};
	}
};
