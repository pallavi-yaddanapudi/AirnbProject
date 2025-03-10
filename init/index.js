const mongoose = require("mongoose");
const initData = require("./data.js"); // Imported data
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection established successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    // Rename the local variable to avoid conflict with imported initData
    let modifiedData = initData.data.map((obj) => ({...obj, owner: "67c7c355d5125e7112bc3b38"}));
    
    await Listing.insertMany(modifiedData); // Use modifiedData, not initData.data
    console.log("Data was initialized");
};

initDB();
