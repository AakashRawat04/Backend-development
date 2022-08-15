const express = require("express");
const fileupload = require("express-fileupload");

const app = express();

app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	fileupload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

app.get("/myget", (req, res) => {
	console.log(req.body);

	// res.send(req.query);
	res.send(req.body);
});

app.post("/mypost", (req, res) => {
	console.log(req.body);
	console.log(req.files);
	// res.send(req.query);
	res.send(req.body);
});

app.get("/mygetform", (req, res) => {
	res.render("getform");
});

app.get("/mypostform", (req, res) => {
	res.render("postform");
});

app.listen(4000, () => console.log(`Server is running at port 4000...`));
