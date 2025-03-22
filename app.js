const express = require("express");
require("dotenv").config();
let cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//server listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  try {
    console.log("App is running on 3001");
  } catch (error) {
    console.log("Error", error.message);
  }
});
