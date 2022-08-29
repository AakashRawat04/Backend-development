const Order = require("../models/order");
const Product = require("../models/product");

const BigPromise = require("../middlewares/bigPromise");

exports.createOrder = BigPromise(async (req, res, next) => {
	const {
		shippingInfo,
		orderItem,
		paymentInfo,
		taxAmount,
		shippingAmount,
		totalAmount,
	} = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItem,
		paymentInfo,
		taxAmount,
		shippingAmount,
		totalAmount,
		user: req.user._id,
	});

	res.status(200).json({
		success: true,
		order,
	});
});
