export const format_usd = (amount) => {
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount.toString());
};
