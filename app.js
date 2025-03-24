const express = require("express");
require("dotenv").config();
let cors = require("cors");
const sequelize = require("./src/config/dbConnect");
const Roles = require("./src/models/role");
const Users = require("./src/models/user");
const app = express();

app.use(express.json());
app.use(cors());

//server listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    console.log("App is running on 3001");
    //db connection
    await sequelize.authenticate();
    console.log("Db Connection has been established successfully.");
    await Roles.sync({force:false});
    await Users.sync({force:false});
  } catch (error) {
    console.log("Error", error.message);
  }
});
