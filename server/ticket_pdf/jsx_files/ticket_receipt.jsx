import { format_usd } from "../utils/format_usd.js";

const { View, Page, Text, Image, StyleSheet, Font } = require("@react-pdf/renderer");
const React = require("react");
const PaymentMethod = require("./payment_method.jsx");

Font.register({
	family: "Helvetica",
	src: `.fonts/Helvetica.ttf`,
});
Font.register({
	family: "Helvetica-Bold",
	src: `.fonts/Helvetica-Bold.ttf`,
});

const text_styles = StyleSheet.create({
	normal: {
		fontFamily: "Helvetica",
		fontSize: 26,
		fontWeight: "light",
	},
	normal_header: {
		fontFamily: "Helvetica",
		fontSize: 18,
		fontWeight: "light",
	},
	bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 32,
		fontWeight: "bold",
	},
	small_bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 22,
		fontWeight: "bold",
	},
	small_normal: {
		fontFamily: "Helvetica",
		fontSize: 26,
		fontWeight: "light",
		marginTop: "30px",
	},
	small_normal_no_margin: {
		fontFamily: "Helvetica",
		fontSize: 22,
		fontWeight: "light",
	},
	large_bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 36,
		fontWeight: "bold",
	},
	large_normal: {
		fontFamily: "Helvetica",
		fontSize: 32,
		fontWeight: "light",
	},
});

const pdfstyles = StyleSheet.create({
	page: {
		backgroundColor: "#E4E4E4",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	header: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		backgroundColor: "#BECBDC",
		height: "100%",
		width: "131.25px",
	},
	footer: {
		height: "100%",
		width: "96px",
		backgroundColor: "#262722",
		justifyContent: "center",
		alignItems: "center",
	},
	ticket_content: {
		flexDirection: "column",
		width: "820px",
		justifyContent: "space-between",
		height: "85%",
		paddingTop: "10px",
		paddingBottom: "10px",
		paddingLeft: "20px",
		paddingRight: "20px",
	},
	column: {
		height: "100%",
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	row: {
		height: "275px",
		width: "100px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	text_row: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	text_column: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	sideways_text: {
		transform: "rotate(-90deg)",
		width: "275px",
		textAlign: "center",
		flexDirection: "row",
	},
	text_wrapper: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
});
const image_styles = StyleSheet.create({
	image_wrapper: {
		height: "200px",
		width: "100px",
		alignItems: "center",
		justifyContent: "center",
	},
	small_image_wrapper: {
		// height: "150px",
		width: "50px",
		alignItems: "center",
	},
	image_row: {
		width: "100px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
	},
	image: {
		// height: "75px",
		width: "250px",
		transform: "rotate(-90deg)",
	},
	small_image: {
		width: "150px",
		// height: "50px",
		transform: "rotate(-90deg)",
	},
});
const TransactionReceipt = ({ event, transaction }) => {
	return (
		<Page size={[1040, 370]} style={pdfstyles.page}>
			<View style={pdfstyles.header}>
				<View style={pdfstyles.column}>
					{/* TODO In future, this will be the logo of the organization and the name will show if the organization has
					 not added a logo. */}
					{/* <View
						break={false}
						style={{
							...pdfstyles.text_wrapper,
							width: "25%",
						}}
					>
						<Text
							break={false}
							style={{
								...text_styles.small_bold,
								...pdfstyles.sideways_text,
							}}
						>
							{user_organization.name}
						</Text>
					</View> */}
					<View style={image_styles.small_image_wrapper}>
						<Image style={image_styles.small_image} src={`./assets/icons/armory_logo_dark_text_only.png`} />
					</View>
					<View
						style={{
							...pdfstyles.text_wrapper,
							width: "24px",
							marginLeft: "5px",
						}}
					>
						<Text
							break={false}
							style={{
								...text_styles.normal_header,
								...pdfstyles.sideways_text,
							}}
						>
							{event.location.address.street}
						</Text>
					</View>
					<View
						style={{
							...pdfstyles.text_wrapper,
							width: "24px",
						}}
					>
						<Text
							break={false}
							style={{
								...text_styles.normal_header,
								...pdfstyles.sideways_text,
							}}
						>
							{event.location.address.city}, {event.location.address.state} {event.location.address.zip}
						</Text>
					</View>
					<View
						style={{
							...pdfstyles.text_wrapper,
							width: "24px",
							marginLeft: "0px",
						}}
					>
						{transaction.first_name && (
							<Text
								break={false}
								style={{
									...text_styles.normal_header,
									...pdfstyles.sideways_text,
								}}
							>
								<Text style={text_styles.small_bold}>For: </Text> {transaction.first_name}{" "}
								{transaction.last_name}
							</Text>
						)}
					</View>
				</View>
			</View>

			<View style={pdfstyles.ticket_content}>
				<Text
					style={{
						...text_styles.bold,
						marginBottom: "10px",
					}}
				>
					Receipt for {event.name}
				</Text>
				<View style={pdfstyles.text_row}>
					<Text
						style={{
							...text_styles.small_bold,
							marginBottom: "10px",
						}}
					>
						Order #: {transaction._id.toString()}
					</Text>
					<PaymentMethod transaction={transaction} />
				</View>
				{transaction?.order?.map((ticket, index) => {
					return (
						<Text
							style={{
								...text_styles.normal,
								marginBottom: "5px",
							}}
							key={index}
						>
							{`${ticket.quantity} x ${ticket.ticket_name} (${format_usd(
								ticket.ticket_tier.price
							)}) = ${format_usd(ticket.ticket_tier.price * ticket.quantity)}`}
						</Text>
					);
				})}
				<Text style={text_styles.small_normal}>Total = {format_usd(transaction.consumer_cost)}</Text>
			</View>
			<View style={pdfstyles.footer}>
				<View style={image_styles.image_row}>
					{/* Temporary Fix for Brighton Armory Logo */}
					{/* Ask David */}

					<View style={image_styles.image_wrapper}>
						<Image style={image_styles.image} src={`./assets/icons/fangarde_logo_white.png`} />
					</View>
					{/* <View style={image_styles.small_image_wrapper}>
						<Image style={image_styles.small_image} src="./assets/icons/brighton_armory_logo.png" />
					</View> */}
				</View>
			</View>
		</Page>
	);
};

module.exports = TransactionReceipt;
