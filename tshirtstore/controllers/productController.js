const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = BigPromise(async (req, res, next) => {
	//images

	let imageArray = [];

	if (!req.files) {
		return next(new CustomError("images are required", 401));
	}

	if (req.files) {
		for (let index = 0; index < req.files.photos.length; index++) {
			let result = await cloudinary.v2.uploader.upload(
				req.files.photos[index].tempFilePath,
				{
					folder: "products",
				}
			);

			imageArray.push({
				id: result.public_id,
				secure_url: result.public_id,
			});
		}
	}

	req.body.photos = imageArray;
	req.body.user = req.user.id;

	const product = await Product.create(req.body);
	res.status(200).json({
		success: true,
		product,
	});
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
	const resultPerPage = 6;
	const totalcountProduct = await Product.countDocuments();

	const productsObj = new WhereClause(Product.find(), req.query)
		.search()
		.filter();

	let products = await productsObj.base;
	const filteredProductNumber = products.length;

	productsObj.pager(resultPerPage);
	products = await productsObj.base.clone();

	res.status(200).json({
		success: true,
		products,
		filteredProductNumber,
		totalcountProduct,
	});
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new CustomError("no product found with this id", 401));
	}

	res.status(200).json({
		success: true,
		product,
	});
});

exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json({
		success: true,
		products,
	});
});
