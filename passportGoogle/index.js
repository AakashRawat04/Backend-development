const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const app = express();

//connect to the DB
mongoose.connect("mongodb://127.0.0.1:27017/passport", () =>
	console.log("DB connected")
);

app.set("view engine", "ejs");

app.use("/auth", auth);
app.get("/", (req, res) => {
	res.render("home");
});

app.listen(4000, () => console.log(`Server is running at port 4000...`));
