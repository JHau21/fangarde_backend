const Organization = require("../../../db/models/organization_model");

module.exports = async function (org_id, org_mailing_list, email_address, opted_in) {
	if (org_id && (opted_in || !opted_in) && email_address) {
		if (!org_mailing_list.includes(email_address) && opted_in) {
			const updated_org = await Organization.findByIdAndUpdate(org_id, {
				$push: {
					mailing_list: email_address,
				},
			});

			return updated_org._id;
		} else if (org_mailing_list.includes(email_address) && !opted_in) {
			const updated_org = await Organization.findByIdAndUpdate(org_id, {
				$pull: {
					mailing_list: email_address,
				},
			});

			return updated_org._id;
		}

		return org_id;
	}

	return org_id;
};
