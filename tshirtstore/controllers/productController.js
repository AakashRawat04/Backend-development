exports.testProduct = async (req, res) => {
	
		res.status(200).json({
			success: true,
			greeting: "this is a test for product route!!",
		});
	
};