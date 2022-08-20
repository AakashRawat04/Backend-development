exports.home = (req, res) => {
	res.status(200).json({
		success: true,
		greeting: "hello from API.",
	});
};

exports.homeDummy = (req, res) => {
	res.status(200).json({
		success: true,
		greeting: "this is another dummy route!!",
	});
};
