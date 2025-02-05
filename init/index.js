const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = "mongodb+srv://shariq:0OhJmBcBPpoTEITi@cluster0.ugkdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj , owner: "678c0410d237003c662618df"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();