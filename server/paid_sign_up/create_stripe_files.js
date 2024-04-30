const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const mongoose = require("mongoose");

/**
 * @param { String } body
 * @param { Array<{ data: ImageFile, name: String, type: String }> } inputted_file
 * this function creates a Stripe file by taking in some file information
 * it then calls the Stripe method to create a Stripe file
 * once the file is created, it returns the generated Stripe file
 */

async function create_stripe_files(purpose, files) {
	let file_ids = [];

	// Stripe doesn't necessarily have an issue with JPEGs but it breaks when certain JPEGs are uploaded?
	// The problem is that the JPEG may not be owned by the user and therefore can't be uploaded I think...
	// ObjectIds are unique identifiers that we can to create unique image files for now...
	// This is important so the same file isn't written to twice

	for (let i = 0; i < files.length; i++) {
		let identifier = new mongoose.Types.ObjectId(); // in case we don't want to use this method to generate identifiers we can make a timestamp + random number + ID as an alternative

		let { data, name, type } = files[i];

		let file_ext = type.replace(/image\//, "");

		let base_64_data = data.replace(/^data:image\/\w+;base64,/, "");

		let binary_string = Buffer.from(base_64_data, "base64").toString("binary");

		let file_path = `./server/paid_sign_up/temp_images/image_${identifier}.${file_ext}`;

		let file_data;

		await fs.writeFileSync(file_path, binary_string, "binary");

		file_data = await fs.readFileSync(file_path);

		let file = await stripe.files.create({
			purpose: purpose,
			file: {
				data: file_data,
				name: name,
				type: type,
			},
		});

		file_ids.push(file.id);

		await fs.unlink(file_path, (err) => {
			if (err) {
				return err;
			}
		});
	}

	return { front_id: file_ids[0], back_id: file_ids[1] };
}

module.exports = function (app) {
	app.post("/create_stripe_files", (request, response) => {
		const { files } = request.body;
		const { front, back } = files;

		create_stripe_files("identity_document", [front.file, back.file])
			.then((file_ids) =>
				// we need to send back the account id to add to the org document and representative id to add to the admin document
				response.status(201).send({
					payload: {
						file_ids,
					},
					message: "Stripe connected account created successfully.",
				})
			)
			.catch((err) => {
				response.status(500).send({
					message: "Failed to create Stripe connected account.",
					error: err,
				});
			});
	});
};
