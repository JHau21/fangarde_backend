module.exports = function (order_total_wo_fees, donation_total, total_paid_tickets, sale_location) {
	let service_fee = 0;
	let processing_fee = 0;

	order_total_wo_fees = Math.round(order_total_wo_fees * 100);
	donation_total = Math.round(donation_total * 100);

	if (sale_location === "online") {
		if (order_total_wo_fees > 0) {
			service_fee = Math.round(order_total_wo_fees * 0.01 + total_paid_tickets * 100);
			processing_fee = Math.round((service_fee + order_total_wo_fees + donation_total) * 0.0299 + 30);
		} else if (order_total_wo_fees === 0 && donation_total > 0) {
			processing_fee = Math.round(donation_total * 0.0299 + 30);
		}

		return {
			service_fee: service_fee / 100,
			processing_fee: processing_fee / 100,
		};
	} else if (sale_location === "at_the_door") {
		if (order_total_wo_fees > 0) {
			service_fee = Math.round(order_total_wo_fees * 0.01 + total_paid_tickets * 100);
			processing_fee = Math.round(order_total_wo_fees * 0.0299 + 30);
		}

		return {
			service_fee: service_fee / 100,
			processing_fee: processing_fee / 100,
		};
	}

	return {
		service_fee,
		processing_fee,
	};
};
