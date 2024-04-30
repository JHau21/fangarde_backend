const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (request, response, next) => {
	if (!request.isAuthenticated) {
		try {
			const token = await request.headers.authorization.split(" ")[1];
			//check if the token matches the supposed origin
			const decodedToken = await jwt.verify(
				token,
				process.env.JWT_ADMIN_AUTH_SECRET
			);

			// retrieve the user details of the logged in user
			const user = await decodedToken;

			// pass the the user down to the endpoints here
			request.user = user;

			// pass down functionality to the endpoint
			next();
		} catch (error) {
			response.status(401).json({
				error: new Error("Invalid request!"),
			});
		}
	} else {
		next();
	}
};
