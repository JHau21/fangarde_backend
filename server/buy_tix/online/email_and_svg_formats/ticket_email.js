module.exports = function stringified_ticket_format(
	total_cost,
	orders,
	custom_email_message,
	org_banner,
	event_search_img,
	event_banner
) {
	// don't say I didn't warn you smh
	let thanks_message;
	let email_image_url;
	let additional_message;
	const default_image_url = "https://drive.google.com/uc?export=view&id=1Npww2o0vRhVP6C7JkVgROaD2-AXIZ4g1";
	const default_thanks = "Thank you for your purchase!";

	if (custom_email_message) {
		const { thank_you_message, additional_details_message, image_option } = custom_email_message;

		thanks_message = thank_you_message ? thank_you_message : default_thanks;
		additional_message = additional_details_message ? additional_details_message : undefined;

		switch (image_option) {
			case "org_banner": {
				email_image_url = org_banner ? org_banner : default_image_url;

				break;
			}
			case "event_search_image": {
				email_image_url = event_search_img ? event_search_img : default_image_url;

				break;
			}
			case "event_banner_image": {
				email_image_url = event_banner ? event_banner : default_image_url;

				break;
			}
			default: {
				email_image_url = default_image_url;

				break;
			}
		}

		if (email_image_url.includes("/static/media")) {
			email_image_url = default_image_url;
		}
	} else {
		thanks_message = default_thanks;
		email_image_url = default_image_url;
	}

	let email_open_wrap = `
    <!DOCTYPE html>
    <html lang="en">
        <head></head>
    </html>
    <html
        lang="en"
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        dir="ltr"
    >
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style type="text/css">
                #outlook a {
                    padding: 0;
                }
                .ReadMsgBody {
                    width: 100%;
                }
                .ExternalClass {
                    width: 100%;
                }
                .ExternalClass * {
                    line-height: 100%;
                }
                body {
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                table,
                td {
                    border-collapse: collapse;
                    mso-table-lspace: 0;
                    mso-table-rspace: 0;
                }
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                }
                p {
                    display: block;
                    margin: 13px 0;
                }
            </style>
            <!--[if mso]>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:AllowPNG />
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
            <![endif]-->
            <!--[if lte mso 11]>
                <style type="text/css">
                    .outlook-group-fix {
                        width: 100% !important;
                    }
                </style>
            <![endif]-->
            <style type="text/css">
                @media only screen and(max-width: 480px) {
                    .dys-desktop {
                        display: none !important;
                    }
                    div.dys-mobile {
                        display: block !important;
                    }
                    tr.dys-mobile {
                        display: table-row !important;
                    }
                }
            </style>
            <style type="text/css"></style>
            <!--[if !mso]><!-->
            <link
                href="https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700"
                rel="stylesheet"
                type="text/css"
            />
            <style type="text/css">
                @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700);
            </style>
            <!--<![endif]-->
        </head>
        <body id="body" style="background-color: #edf0f2">
            <span style="display: none; max-height: 0px; overflow: hidden"></span>
            <div style="background-color: #edf0f2" class="">
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="wrapper-outlook" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    class="wrapper"
                    style="
                        background: #edf0f2;
                        background-color: #edf0f2;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #edf0f2;
                            background-color: #edf0f2;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            class="mobile_hide"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        height="16"
                                                                                                        style="
                                                                                                            height: 16px;
                                                                                                            line-height: 16px;
                                                                                                        "
                                                                                                    >
                                                                                                        &nbsp;
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                        <table
                                                                                            bg="#ffffff"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            class="rounded-none"
                                                                                            style="
                                                                                                border-radius: 8px
                                                                                                    8px
                                                                                                    0
                                                                                                    0;
                                                                                                background: #ffffff;
                                                                                                width: 100%;
                                                                                            "
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        class="h-24"
                                                                                                        height="52"
                                                                                                        style="
                                                                                                            height: 52px;
                                                                                                        "
                                                                                                    >
                                                                                                        &nbsp;
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #ffffff;
                            background-color: #ffffff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            padding="0"
                                                                                            style="
                                                                                                width: 100%;
                                                                                            "
                                                                                            width="100%"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        align="left"
                                                                                                        style="
                                                                                                            vertical-align: middle;
                                                                                                            width: 80px;
                                                                                                        "
                                                                                                        width="80"
                                                                                                    >
                                                                                                        <a
                                                                                                            href="https://www.fangarde.com/"
                                                                                                            ><span
                                                                                                                style="
                                                                                                                    color: #0e1318;
                                                                                                                    text-decoration: none;
                                                                                                                "
                                                                                                            >
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    height="auto"
                                                                                                                    src=${email_image_url}
                                                                                                                    style="
                                                                                                                        border: none;
                                                                                                                        display: block;
                                                                                                                        font-size: 13px;
                                                                                                                        outline: none;
                                                                                                                        text-decoration: none;
                                                                                                                        width: 100%;
                                                                                                                        height: auto;
                                                                                                                        border-radius: 8px
                                                                                                                    "
                                                                                                                    width="80"
                                                                                                                /> </span
                                                                                                        ></a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                    <td
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td
                                                                                        class="h-24"
                                                                                        height="44"
                                                                                        style="
                                                                                            height: 44px;
                                                                                        "
                                                                                    >
                                                                                        &nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="style="
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                    font-size: 20px;
                                                                                                "
                                                                                            >
                                                                                                ${thanks_message}
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                `;

	if (additional_message) {
		email_open_wrap += `<!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
    <div
        style="
            background: #ffffff;
            background-color: #ffffff;
            margin: 0px auto;
            max-width: 600px;
        "
    >
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
                background: #ffffff;
                background-color: #ffffff;
                width: 100%;
            "
        >
            <tbody>
                <tr></tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
    <!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
    <div
        style="
            background: #fff;
            background-color: #fff;
            margin: 0px auto;
            max-width: 600px;
        "
    >
        <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
                background: #fff;
                background-color: #fff;
                width: 100%;
            "
        >
            <tbody>
                <tr>
                    <td
                        style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 0;
                            text-align: center;
                            vertical-align: top;
                        "
                    >
                        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                        <div
                            class="dys-column-per-100 outlook-group-fix"
                            style="
                                direction: ltr;
                                display: inline-block;
                                font-size: 13px;
                                text-align: left;
                                vertical-align: top;
                                width: 100%;
                            "
                        >
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                width="100%"
                            >
                                <tbody>
                                    <tr>
                                        <td 
                                            style="
                                                padding: 0;
                                                padding-bottom: 12px;
                                                padding-top: 12px;
                                                vertical-align: top;
                                            "
                                        >
                                            <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                                style=""
                                                width="100%"
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            align="left"
                                                            style="
                                                                font-size: 0px;
                                                                padding: 0;
                                                                word-break: break-word;
                                                            "
                                                        >
                                                            <table
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="
                                                                    color: #000000;
                                                                    font-family: Helvetica,
                                                                        Arial,
                                                                        sans-serif;
                                                                    font-size: 13px;
                                                                    line-height: 22px;
                                                                    table-layout: auto;
                                                                    width: 100%;
                                                                "
                                                                width="100%"
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <th
                                                                            class="wrapper-margin"
                                                                            width="48"
                                                                        >
                                                                            &nbsp;
                                                                        </th>
                                                                        <th
                                                                            style="
                                                                                color: #0e1318;
                                                                                font-family: Open
                                                                                        Sans,
                                                                                    Helvetica,
                                                                                    Arial,
                                                                                    sans
                                                                                        serif;
                                                                                font-size: 16px;
                                                                                font-weight: 400;
                                                                                line-height: 160%;
                                                                                text-align: center;
                                                                            "
                                                                        >
                                                                            <span
                                                                                ><span
                                                                                    style="
                                                                                        color: rgb(
                                                                                            0,
                                                                                            0,
                                                                                            0
                                                                                        );
                                                                                    "
                                                                                ></span
                                                                                ><span
                                                                                    style="
                                                                                        color: rgb(
                                                                                            0,
                                                                                            0,
                                                                                            0
                                                                                        );
                                                                                    "
                                                                                >
                                                                                    ${additional_message}
                                                                                </span></span
                                                                            >
                                                                        </th>
                                                                        <th
                                                                            class="wrapper-margin"
                                                                            width="48"
                                                                        >
                                                                            &nbsp;
                                                                        </th>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->`;
	}

	const email_middle_wrap = `
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #ffffff;
                            background-color: #ffffff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td 
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="
                                                                                            color: #0e1318;
                                                                                            font-family: Open
                                                                                                    Sans,
                                                                                                Helvetica,
                                                                                                Arial,
                                                                                                sans
                                                                                                    serif;
                                                                                            font-size: 16px;
                                                                                            font-weight: 400;
                                                                                            line-height: 160%;
                                                                                            text-align: center;
                                                                                        "
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            ></span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            >
                                                                                                To
                                                                                                view
                                                                                                and
                                                                                                download
                                                                                                your
                                                                                                tickets,
                                                                                                see
                                                                                                the
                                                                                                attachments
                                                                                                below.
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #ffffff;
                            background-color: #ffffff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="
                                                                                            color: #0e1318;
                                                                                            font-family: Open
                                                                                                    Sans,
                                                                                                Helvetica,
                                                                                                Arial,
                                                                                                sans
                                                                                                    serif;
                                                                                            font-size: 16px;
                                                                                            font-weight: 400;
                                                                                            line-height: 160%;
                                                                                            text-align: center;
                                                                                        "
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            ></span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            >
                                                                                                If
                                                                                                you
                                                                                                have
                                                                                                any
                                                                                                issues
                                                                                                viewing,
                                                                                                downloading,
                                                                                                or
                                                                                                using
                                                                                                any
                                                                                                of
                                                                                                your
                                                                                                tickets,
                                                                                                please
                                                                                                email
                                                                                                us
                                                                                                at
                                                                                                <a
                                                                                                    style="
                                                                                                        color: #5d86a4;
                                                                                                    "
                                                                                                    href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=contact@fangarde.com"
                                                                                                    >contact@fangarde.com</a
                                                                                                >
                                                                                                or
                                                                                                call
                                                                                                us
                                                                                                at
                                                                                                (303)
                                                                                                859-4840.
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #ffffff;
                            background-color: #ffffff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                    <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="style="
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                    font-size: 20px;
                                                                                                "
                                                                                            >
                                                                                                Receipt
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="
                                                                                            color: #0e1318;
                                                                                            font-family: Open
                                                                                                    Sans,
                                                                                                Helvetica,
                                                                                                Arial,
                                                                                                sans
                                                                                                    serif;
                                                                                            font-size: 16px;
                                                                                            font-weight: 400;
                                                                                            line-height: 160%;
                                                                                            text-align: center;
                                                                                        "
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            ></span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                "
                                                                                            >
                                                                                                Total
                                                                                                Cost: 
                                                                                                ${total_cost}
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]-->
                <div
                    style="
                        background: #fff;
                        background-color: #fff;
                        margin: 0px auto;
                        max-width: 600px;
                    "
                >
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                            background: #fff;
                            background-color: #fff;
                            width: 100%;
                        "
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            padding-bottom: 12px;
                                                            padding-top: 12px;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                    <th
                                                                                        style="style="
                                                                                    >
                                                                                        <span
                                                                                            ><span
                                                                                                style="
                                                                                                    color: rgb(
                                                                                                        0,
                                                                                                        0,
                                                                                                        0
                                                                                                    );
                                                                                                    font-size: 20px;
                                                                                                "
                                                                                            >
                                                                                                Tickets
                                                                                            </span></span
                                                                                        >
                                                                                    </th>
                                                                                    <th
                                                                                        class="wrapper-margin"
                                                                                        width="48"
                                                                                    >
                                                                                        &nbsp;
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                <![endif]-->
            `;
	const email_close_wrap = `
                <!--[if mso | IE]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]-->
                <div style="margin: 0px auto; max-width: 600px">
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="width: 100%"
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            background-color: #fff;
                                                            padding: 0;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th
                                                                                        height="8"
                                                                                        style="
                                                                                            line-height: 0;
                                                                                        "
                                                                                    ></th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                <div style="margin: 0px auto; max-width: 600px">
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="width: 100%"
                    >
                        <tbody>
                            <tr>
                                <td
                                    style="
                                        direction: ltr;
                                        font-size: 0px;
                                        padding: 0;
                                        text-align: center;
                                        vertical-align: top;
                                    "
                                >
                                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                    <![endif]-->
                                    <div
                                        class="dys-column-per-100 outlook-group-fix"
                                        style="
                                            direction: ltr;
                                            display: inline-block;
                                            font-size: 13px;
                                            text-align: left;
                                            vertical-align: top;
                                            width: 100%;
                                        "
                                    >
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding: 0;
                                                            vertical-align: top;
                                                        "
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style=""
                                                            width="100%"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        style="
                                                                            font-size: 0px;
                                                                            padding: 0;
                                                                            word-break: break-word;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                color: #000000;
                                                                                font-family: Helvetica,
                                                                                    Arial,
                                                                                    sans-serif;
                                                                                font-size: 13px;
                                                                                line-height: 22px;
                                                                                table-layout: auto;
                                                                                width: 100%;
                                                                            "
                                                                            width="100%"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td
                                                                                        colspan="3"
                                                                                    >
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            class="border-radius-for-large"
                                                                                            style="
                                                                                                border-radius: 0
                                                                                                    0
                                                                                                    8px
                                                                                                    8px;
                                                                                                background: #ffffff;
                                                                                                width: 100%;
                                                                                            "
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        height="36"
                                                                                                    >
                                                                                                        &nbsp;
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td
                                                                                        colspan="3"
                                                                                    >
                                                                                        <div
                                                                                            class="footer-bg-mobile"
                                                                                            style="
                                                                                                background-color: #edf0f2;
                                                                                            "
                                                                                        >
                                                                                            <table
                                                                                                border="0"
                                                                                                cellpadding="0"
                                                                                                cellspacing="0"
                                                                                                style="
                                                                                                    color: #000000;
                                                                                                    font-family: Helvetica,
                                                                                                        Arial,
                                                                                                        sans-serif;
                                                                                                    font-size: 13px;
                                                                                                    line-height: 22px;
                                                                                                    table-layout: auto;
                                                                                                    width: 100%;
                                                                                                "
                                                                                                width="100%"
                                                                                            >
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            height="24"
                                                                                                        >
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            width="24"
                                                                                                        >
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div
                                                                                                                style="
                                                                                                                    color: #565a5d;
                                                                                                                    font-family: Open
                                                                                                                            Sans,
                                                                                                                        Helvetica,
                                                                                                                        Arial,
                                                                                                                        sans
                                                                                                                            serif;
                                                                                                                    font-size: 14px;
                                                                                                                    line-height: 160%;
                                                                                                                    text-align: center;
                                                                                                                "
                                                                                                            >
                                                                                                                You
                                                                                                                are
                                                                                                                receiving
                                                                                                                this
                                                                                                                email
                                                                                                                because
                                                                                                                you
                                                                                                                purchased
                                                                                                                tickets
                                                                                                                through
                                                                                                                Fangarde.
                                                                                                                Please
                                                                                                                contact
                                                                                                                us
                                                                                                                if
                                                                                                                you
                                                                                                                think
                                                                                                                you
                                                                                                                recieved
                                                                                                                this
                                                                                                                email
                                                                                                                by
                                                                                                                mistake.
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td
                                                                                                            width="24"
                                                                                                        >
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            colspan="3"
                                                                                                            height="24"
                                                                                                            style="
                                                                                                                border-bottom: 1px
                                                                                                                    solid
                                                                                                                    #dde1e3;
                                                                                                            "
                                                                                                        >
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            height="24"
                                                                                                        >
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>

                                                                                                    <tr>
                                                                                                        <td
                                                                                                            colspan="3"
                                                                                                        >
                                                                                                            <table
                                                                                                                align="center"
                                                                                                                cellpadding="0"
                                                                                                                cellspacing="0"
                                                                                                                width="auto"
                                                                                                            >
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <th>
                                                                                                                            <a
                                                                                                                                href="https://fangarde.com"
                                                                                                                                style="color: #565a5d; font-family: Open Sans, Helvetica, Arial, sans serif; font-size: 14px; font-weight: 400; line-height: 160%text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        color: #565a5d;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    Visit
                                                                                                                                    fangarde.com</span
                                                                                                                                ></a
                                                                                                                            >
                                                                                                                        </th>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <th>
                                                                                                                            <a
                                                                                                                                href="contact@fangarde.com"
                                                                                                                                style="color: #565a5d; font-family: Open Sans, Helvetica, Arial, sans serif; font-size: 14px; font-weight: 400; line-height: 160%text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        color: #565a5d;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    contact@fangarde.com</span
                                                                                                                                ></a
                                                                                                                            >
                                                                                                                        </th>
                                                                                                                        <th
                                                                                                                            width="16px"
                                                                                                                        ></th>
                                                                                                                        <th></th>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                            <table
                                                                                                                align="center"
                                                                                                                cellpadding="0"
                                                                                                                cellspacing="0"
                                                                                                                width="auto"
                                                                                                            >
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <th></th>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            height="16"
                                                                                                        ></td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            align="center"
                                                                                                            colspan="3"
                                                                                                        >
                                                                                                            <table
                                                                                                                border="0"
                                                                                                                cellpadding="0"
                                                                                                                cellspacing="0"
                                                                                                                style="
                                                                                                                    color: #000000;
                                                                                                                    font-family: Helvetica,
                                                                                                                        Arial,
                                                                                                                        sans-serif;
                                                                                                                    font-size: 13px;
                                                                                                                    line-height: 22px;
                                                                                                                    table-layout: auto;
                                                                                                                    width: 144px;
                                                                                                                "
                                                                                                                width="144"
                                                                                                            >
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <th
                                                                                                                            width="24px"
                                                                                                                        >
                                                                                                                            <a
                                                                                                                                href="https://www.facebook.com/people/FanGarde/100089594965532/"
                                                                                                                                style="line-height: 0; display: blockcolor:#0E1318;text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        text-decoration: none;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    <img
                                                                                                                                        alt="facebook"
                                                                                                                                        src="https://appboy-images.com/appboy/communication/assets/image_assets/images/5e01866c167e920348c59e1f/original.png?1577158252"
                                                                                                                                    /> </span
                                                                                                                            ></a>
                                                                                                                        </th>
                                                                                                                        <th
                                                                                                                            width="16px"
                                                                                                                        ></th>
                                                                                                                        <th
                                                                                                                            width="24px"
                                                                                                                        >
                                                                                                                            <a
                                                                                                                                href="https://twitter.com/FanGardeTicket"
                                                                                                                                style="line-height: 0; display: blockcolor:#0E1318;text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        text-decoration: none;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    <img
                                                                                                                                        alt="twitter"
                                                                                                                                        src='https://static.wixstatic.com/media/b99bc9_78ea41b05d8f4c07bbfe6cf9ad564f78~mv2.png/v1/fill/w_61,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Picture3.png"'
                                                                                                                                        width="24"
                                                                                                                                    /> </span
                                                                                                                            ></a>
                                                                                                                        </th>
                                                                                                                        <th
                                                                                                                            width="16px"
                                                                                                                        ></th>
                                                                                                                        <th
                                                                                                                            width="24px"
                                                                                                                        >
                                                                                                                            <a
                                                                                                                                href="https://www.linkedin.com/company/fangarde/?viewAsMember=true"
                                                                                                                                style="line-height: 0; display: blockcolor:#0E1318;text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        text-decoration: none;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    <img
                                                                                                                                        alt="linkedin"
                                                                                                                                        src="https://static.wixstatic.com/media/b99bc9_7a4c2ab70ea6405085c5799e74088144~mv2.png/v1/fill/w_53,h_53,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Picture4.png"
                                                                                                                                        width="20"
                                                                                                                                    /> </span
                                                                                                                            ></a>
                                                                                                                        </th>
                                                                                                                        <th
                                                                                                                            width="16px"
                                                                                                                        ></th>
                                                                                                                        <th
                                                                                                                            width="24px"
                                                                                                                        >
                                                                                                                            <a
                                                                                                                                href="https://www.instagram.com/fangardeticketing"
                                                                                                                                style="line-height: 0; display: blockcolor:#0E1318;text-decoration:none;"
                                                                                                                                ><span
                                                                                                                                    style="
                                                                                                                                        text-decoration: none;
                                                                                                                                    "
                                                                                                                                >
                                                                                                                                    <img
                                                                                                                                        alt="instagram"
                                                                                                                                        src="https://appboy-images.com/appboy/communication/assets/image_assets/images/5e01866d5b99ac6f6aaa44d0/original.png?1577158253"
                                                                                                                                    /> </span
                                                                                                                            ></a>
                                                                                                                        </th>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            height="48px"
                                                                                                        ></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]-->
            </div>
        </body>
    </html>
    `;
	let email_receipt_items = `
        <!--[if mso | IE]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->`;

	// if only one ticket is purchased, the email clips for some reason?

	for (const order of orders) {
		const { quantity, ticket_name, ticket_tier } = order;

		email_receipt_items += `
            <!--[if mso | IE]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
            <div
                style="
                    background: #fff;
                    background-color: #fff;
                    margin: 0px auto;
                    max-width: 600px;
                "
            >
                <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                        background: #fff;
                        background-color: #fff;
                        width: 100%;
                    "
                >
                    <tbody>
                        <tr>
                            <td
                                style="
                                    direction: ltr;
                                    font-size: 0px;
                                    padding: 0;
                                    text-align: center;
                                    vertical-align: top;
                                "
                            >
                                <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                <![endif]-->
                                <div
                                    class="dys-column-per-100 outlook-group-fix"
                                    style="
                                        direction: ltr;
                                        display: inline-block;
                                        font-size: 13px;
                                        text-align: left;
                                        vertical-align: top;
                                        width: 100%;
                                    "
                                >
                                    <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        width="100%"
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="
                                                        padding: 0;
                                                        padding-bottom: 12px;
                                                        padding-top: 12px;
                                                        vertical-align: top;
                                                    "
                                                >
                                                    <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        style=""
                                                        width="100%"
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    align="left"
                                                                    style="
                                                                        font-size: 0px;
                                                                        padding: 0;
                                                                        word-break: break-word;
                                                                    "
                                                                >
                                                                    <table
                                                                        border="0"
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                        style="
                                                                            color: #000000;
                                                                            font-family: Helvetica,
                                                                                Arial,
                                                                                sans-serif;
                                                                            font-size: 13px;
                                                                            line-height: 22px;
                                                                            table-layout: auto;
                                                                            width: 100%;
                                                                        "
                                                                        width="100%"
                                                                    >
                                                                        <tbody>
                                                                            <tr>
                                                                                <th
                                                                                    class="wrapper-margin"
                                                                                    width="48"
                                                                                >
                                                                                    &nbsp;
                                                                                </th>
                                                                                <th
                                                                                    style="
                                                                                        color: #0e1318;
                                                                                        font-family: Open
                                                                                                Sans,
                                                                                            Helvetica,
                                                                                            Arial,
                                                                                            sans
                                                                                                serif;
                                                                                        font-size: 16px;
                                                                                        font-weight: 400;
                                                                                        line-height: 160%;
                                                                                        text-align: center;
                                                                                    "
                                                                                >
                                                                                    <span
                                                                                        ><span
                                                                                            style="
                                                                                                color: rgb(
                                                                                                    0,
                                                                                                    0,
                                                                                                    0
                                                                                                );
                                                                                            "
                                                                                        ></span
                                                                                        ><span
                                                                                            style="
                                                                                                color: rgb(
                                                                                                    0,
                                                                                                    0,
                                                                                                    0
                                                                                                );
                                                                                            "
                                                                                        >
                                                                                            ${quantity}x
                                                                                            ${ticket_name}
                                                                                            /
                                                                                            <span
                                                                                                class="common_font_small"
                                                                                                style="
                                                                                                    color: #808080;
                                                                                                "
                                                                                                >${ticket_tier}</span
                                                                                            >
                                                                                        </span></span
                                                                                    >
                                                                                </th>
                                                                                <th
                                                                                    class="wrapper-margin"
                                                                                    width="48"
                                                                                >
                                                                                    &nbsp;
                                                                                </th>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
                                    </td></tr></table>
                                <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
                </td></tr></table>
            <![endif]-->
        `;
	}

	const final_email = email_open_wrap + email_middle_wrap + email_receipt_items + email_close_wrap;

	return final_email;
};
