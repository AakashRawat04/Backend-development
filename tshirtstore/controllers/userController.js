const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");

exports.signup = BigPromise(async (req, res, next) => {
	// let result;
	if (!req.files) {
		return next(new CustomError("photo is required for signup", 400));
	}

	const { name, email, password } = req.body;

	if (!email || !name || !password) {
		return next(new CustomError("Name, Email and password are required", 400));
	}

	if (req.files) {
		let file = req.files.photo;
		result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
			folder: "users",
			width: 150,
			crop: "scale",
		});
	}

	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url,
		},
	});

	cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
	const { email, password } = req.body;

	//check for presence of email and password
	if (!email || !password) {
		return next(new CustomError("please provide email and password", 400));
	}

	// get user from DB
	const user = await User.findOne({ email }).select("+password");

	//if user not found in DB
	if (!user) {
		return next(
			new CustomError("Email or password does not match or exist", 400)
		);
	}

	//match the password
	const isPasswordCorrect = await user.isValidatedPassword(password);

	//if password do not match
	if (!isPasswordCorrect) {
		return next(
			new CustomError("Email or password does not match or exist", 400)
		);
	}

	//if all goes good and we send the token
	cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logout success",
	});
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return next(new CustomError("email not found as registered!", 500));
	}

	const forgotToken = user.getForgotPasswordToken();

	await user.save({ validateBeforeSave: false });

	const myUrl = `${req.protocol}://${req.get(
		"host"
	)}/password/reset/${forgotToken}`;

	const message = `Copy paste this link in your URL and hit enter\n\n${myUrl}`;

	try {
		await mailHelper({
			email: user.email,
			subject: "AshDev: password reset email",
			message,
		});
		res.status(200).json({
			success: true,
			message: "email sent successfully",
		});
	} catch (error) {
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiry = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new CustomError(error.message, 500));
	}
});
