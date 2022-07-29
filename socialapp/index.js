const express = require("express");
const format = require("date-format");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.status(200).send("<h1>Hello from Ash</h1>");
});

app.get("/api/v1/instagram", (req, res) => {
	const instaSocial = {
		username: "aakashrawatInstapage",
		followers: 69,
		follows: 70,
		date: format.asString("dd[MM] -- hh:mm:ss", new Date()),
	};

	res.status(200).json({ instaSocial });
});

app.get("/api/v1/facebook", (req, res) => {
	const instaSocial = {
		username: "aakashrawatFacebookpage",
		followers: 69,
		follows: 70,
		date: format.asString("dd[MM] -- hh:mm:ss", new Date()),
	};

	res.status(200).json({ instaSocial });
});

app.get("/api/v1/linkedin", (req, res) => {
	const instaSocial = {
		username: "aakashrawatlinkedinpage",
		followers: 69,
		follows: 70,
		date: format.asString("dd[MM] -- hh:mm:ss", new Date()),
	};

	res.status(200).json({ instaSocial });
});

app.get("/api/v1/:token", (req, res) => {
	console.log(req.params.token);
	res.status(200).json({ param: req.params.token });
});

app.listen(PORT, () => {
	console.log(`server is running at PORT ${PORT}`);
});
