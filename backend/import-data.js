const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");

const User = require("./models/userModel");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then((con) => {
	// console.log(con.connections);
	console.log("Connection Successful");
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
console.log(users);
// IMPORT DATA INTO DB
const importData = async () => {
	try {
		await User.create(users);

		console.log("Data successfully loaded!");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
	try {
		
		await User.deleteMany();
		
		console.log("Data successfully deleted!");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
