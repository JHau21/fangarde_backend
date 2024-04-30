// set of all endpoints
const valid_resources = [
	"/register_admin",
	"/register_user",
	"/admin_exists",
	"/user_exists",
	"/create_customer_stripe_account",
	"/create_stripe_files",
	"/login_user",
	"/fetch_account",
	"/login_admin",
	"/create_ticket_event",
	"/events_fetch_init",
	"/events_search_all",
	"/get_all_organization_events",
	"/search_events",
	"/update_event",
	"/get_transactions",
	"/fetch_single_event",
	"/fetch_pos_events",
	"/get_admins",
	"/update_admins",
	"/update_admin",
	"/update_admin_password",
	"/update_user",
	"/update_user_password",
	"/update_organization",
	"/save_location",
	"/delete_location",
	"/create_promo_code",
	"/delete_promo_codes",
	"/fetch_promo_codes",
	"/update_promo_code",
	"/verify_promo_code",
	"/get_init_accounting_events",
	"/refund_transaction",
	"/refund_event",
	"/get_event_transactions",
	"/get_event_accounting_statement",
	"/get_monthly_accounting_statement",
	"/update_financial_settings",
	"/delete_stripe_bank_account",
	"/add_new_bank_account",
	"/retrieve_stripe_bank_accounts",
	"/get_ticket_pdf",
	"/contact_form",
	"/create_new_location",
	"/create_new_terminal",
	"/delete_existing_terminal",
	"/update_existing_terminal",
	"/capture_payment_intent",
	"/create_payment_intent",
	"/process_payment_intent",
	"/box_office_sale",
	"/online_sale",
];

/**
 * @param { String } resource_url
 * @returns { Boolean }
 * Takes in the client-requested url and checks it against the set of existing endpoints
 * Returns true of false depending on whether or not the requested endpoint exists
 */

module.exports = function (resource_url) {
	return valid_resources.includes(resource_url);
};
