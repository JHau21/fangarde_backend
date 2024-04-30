const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
	//Connection using MongoClient
	// return new MongoClient(process.env.DB_CONNECTION_URI);

	// Connection using mongoose
	mongoose
		.connect(process.env.DB_CONNECTION_URI)
		.then((res) => {
			console.log("Successfully connected to MongoDB Atlas!");

			return res;
		})
		.catch((error) => {
			console.log("404: Unable to connect to MongoDB Atlas!");
			console.error(error);
		});
}

module.exports = dbConnect;
