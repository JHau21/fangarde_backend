const { View, Text, StyleSheet } = require("@react-pdf/renderer");
const React = require("react");

const text_styles = StyleSheet.create({
	small_normal_no_margin: {
		fontFamily: "Helvetica",
		fontSize: 22,
		fontWeight: "light",
	},
});

const pdfstyles = StyleSheet.create({
	text_column: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
});

const PaymentMethod = ({ transaction }) => {
	return (
		<View style={pdfstyles.text_column}>
			<Text
				style={{
					...text_styles.small_bold,
					marginBottom: "10px",
				}}
			>
				Payment Method
			</Text>
			{transaction.transaction_type === "card" && (
				<Text
					style={{
						...text_styles.small_normal_no_margin,
						marginBottom: "10px",
					}}
				>
					Card ending in - {transaction.last_four_card_digits}
				</Text>
			)}
			{transaction.transaction_type === "free" && (
				<Text
					style={{
						...text_styles.small_normal_no_margin,
						marginBottom: "10px",
					}}
				>
					In Kind
				</Text>
			)}
			{transaction.transaction_type === "cash" && (
				<Text
					style={{
						...text_styles.small_normal_no_margin,
						marginBottom: "10px",
					}}
				>
					Cash
				</Text>
			)}
		</View>
	);
};

module.exports = PaymentMethod;
