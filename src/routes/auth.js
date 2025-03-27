const express = require('express');
const authController = require('../controllers/auth/index')
const validateSchema = require("../middlewares/validator");
const registerSchema = require('../middlewares/validationSchema/registerUser');
const authRouter = express.Router();

authRouter.post('/register',validateSchema(registerSchema), authController.registerUser);
authRouter.get("/verify-account/:token",authController.verifyAccount);

module.exports = authRouter;


// http://localhost:3001/api/auth/register --> post method
