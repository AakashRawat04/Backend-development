const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config();

// connect with database
connectWithDb();

app.listen(process.env.PORT, () => {
	console.log(`server is running at port: ${process.env.PORT}`);
});
