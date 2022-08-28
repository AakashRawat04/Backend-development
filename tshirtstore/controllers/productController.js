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

exports.addReview = BigPromise(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const AlreadyReview = product.reviews.find(
		(rev) => rev.user.toString() === req.user._id.toString()
	);

	if (AlreadyReview) {
		product.reviews.forEach((review) => {
			if (review.user.toString() === req.user._id.toString()) {
				review.comment = comment;
				review.rating = rating;
			}
		});
	} else {
		product.reviews.push(review);
		product.numberOfReviews = product.reviews.length;
	}

	// adjust ratings
	product.ratings =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) /
		product.reviews.length;

	// save
	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

// admin only controllers
exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json({
		success: true,
		products,
	});
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
	let product = await Product.findById(req.params.id);

	if (!product) {
		return next(new CustomError("no product found with this id", 401));
	}

	let imagesArray = [];

	if (req.fiels) {
		// destroy the existing image
		for (let index = 0; index < product.photos.length; index++) {
			const result = await cloudinary.v2.uploader.destroy(
				product.photos[index].id
			);
		}
		//upload and save the images
		for (let index = 0; index < req.files.photos.length; index++) {
			let result = await cloudinary.v2.uploader.upload(
				req.files.photos[index].tempFilePath,
				{
					folder: "products", // folder name -> .env
				}
			);

			imagesArray.push({
				id: result.public_id,
				secure_url: result.public_id,
			});
		}
	}

	req.body.photos = imagesArray;

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		product,
	});
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new CustomError("no product found with this id", 401));
	}

	// destroy the existing image
	for (let index = 0; index < product.photos.length; index++) {
		const result = await cloudinary.v2.uploader.destroy(
			product.photos[index].id
		);
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: "Product was deleted!",
	});
});
