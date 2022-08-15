const express = require("express");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

cloudinary.config({
	// cloud_name: process.env.CLOUD_NAME
	cloud_name: "da0ydzzy0",
	api_key: "348294186687289",
	api_secret: "6-lN7NnmVtI07qWQosi5h1V580M",
});

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

app.post("/mypost", async (req, res) => {
	console.log(req.body);
	console.log(req.files);
	// res.send(req.query);

	let file = req.files.samplefile;

	result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: "users",
	});

	console.log(result);

	details = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		result,
	};
	res.send(details);
});

app.get("/mygetform", (req, res) => {
	res.render("getform");
});

app.get("/mypostform", (req, res) => {
	res.render("postform");
});

app.listen(4000, () => console.log(`Server is running at port 4000...`));
