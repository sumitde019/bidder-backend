const express = require('express');
const authController = require('../controllers/auth/index')
const validateSchema = require("../middlewares/validator");
const registerSchema = require('../middlewares/validationSchema/registerUser');
const loginSchema = require('../middlewares/validationSchema/loginUser');
const authRouter = express.Router();

authRouter.post('/register',validateSchema(registerSchema), authController.registerUser);
authRouter.get("/verify-account/:token",authController.verifyAccount);
authRouter.post("/login",validateSchema(loginSchema), authController.loginUser);

module.exports = authRouter;

