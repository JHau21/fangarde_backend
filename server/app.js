require("@babel/register");

const express = require("express");
const body_parser = require("body-parser");

const admin_auth = require("./auth/admin_auth");
const validate_req_url = require("./utils/validate_req_url");

const dbConnect = require("./db/db_connect");

const app = express();

app.use(body_parser.json({ limit: "16mb" }));

// handle preflight requests
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

	if (req.method === "OPTIONS") {
		res.status(200).send();
	} else {
		next();
	}
});

// handle request URL verification
app.use((req, res, next) => {
	const resource_url = req.originalUrl;

	if (validate_req_url(resource_url)) {
		next();
	} else {
		console.log(`Rejected request to ${resource_url}. Resource doesn't exist!`);

		res.status(404).send({
			message: `The requested resource '${resource_url}' does not exist!`,
		});
	}
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
	console.log("Listening on port ", port);
});

dbConnect();

// registration endpoints
require("./register/register_admin")(app);
require("./register/register_user")(app);
require("./register/admin_exists")(app);
require("./register/user_exists")(app);
require("./paid_sign_up/create_customer_stripe_account")(app);
require("./paid_sign_up/create_stripe_files")(app);

// login endpoints
require("./login/login_user")(app);
require("./login/login_admin")(app);

// event endpoints
require("./events/create_ticket_event")(app);
require("./events/events_fetch_init")(app);
require("./events/events_search_all")(app);
require("./events/events")(app);
require("./events/event_fetch_single_event")(app);
require("./events/fetch_pos_events")(app);

// user endpoints
require("./users/admins")(app);

// organization endpoints
require("./organization/organization")(app);

// promocode endpoints
require("./promocodes/create_promo_code")(app);
require("./promocodes/delete_promo_code")(app);
require("./promocodes/fetch_promo_codes")(app);
require("./promocodes/update_promo_code")(app);
require("./promocodes/verify_promo_code")(app);

// books endpoints
require("./accounting/books/accounting_get_init")(app);
require("./accounting/books/refund_transaction")(app);
require("./accounting/books/refund_event")(app);
require("./accounting/statements/send_accounting_statement")(app);
require("./accounting/books/get_accounting_transactions")(app);
require("./accounting/statements/get_event_accounting_statement")(app);
require("./accounting/statements/get_monthly_accounting_statement")(app);

// banking endpoints
require("./accounting/banking/update_financial_settings")(app);
require("./accounting/banking/delete_bank_account")(app);
require("./accounting/banking/create_bank_account")(app);
require("./accounting/banking/fetch_bank_accounts")(app);

// ticket generation endpoints
require("./ticket_pdf/get_ticket_pdf")(app);

// contact endpoint
require("./contact/contact_form")(app);

// terminal endpoints
require("./terminal/create_new_location")(app);
require("./terminal/create_new_terminal")(app);
require("./terminal/delete_existing_terminal")(app);
require("./terminal/update_existing_terminal")(app);

// box office sale endpoints
require("./buy_tix/box_office/card_processing_endpoints/capture_payment_intent")(app);
require("./buy_tix/box_office/card_processing_endpoints/create_payment_intent")(app);
require("./buy_tix/box_office/card_processing_endpoints/process_payment_intent")(app);
require("./buy_tix/box_office/box_office_sale")(app);

// online sale endpoints
require("./buy_tix/online/online_sale")(app);

// free endpoint
app.get("/home", (request, response) => {
	response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/account", admin_auth, (request, response) => {
	response.json({ message: "You are authorized to access me" });
});
