const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const { router } = require("../src/routes/route");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to database established");
  } catch (err) {
    console.log("Failed to connect to database", err);
  }
}

app.use(express.json());
app.use("/api", router);
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
