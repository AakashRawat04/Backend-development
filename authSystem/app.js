require("dotenv").config();
const express = require("express");

const User = require("./model/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
	res.send("<h1>Hello from auth system</h1>");
});

app.post("/register", (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	if (!(email && password && firstname && lastname)) {
		res.status(400).send("All fields are required!");
	}

	const existingUser = User.findOne({ email });

	if (existingUser) {
		res.status(401).send("User already exists!");
	}
});

module.exports = app;
