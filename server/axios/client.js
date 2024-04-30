const axios_dep = require("axios");
const config = require("./axios_config");

const axios = axios_dep.create({
	baseURL: config.apiGateway,
	headers: {
		"Content-Type": "application/json",
	},
});

module.exports = axios;
