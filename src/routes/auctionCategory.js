const express = require("express");
const auctionCategoryController = require('../controllers/auctionCategory/index');
const validateSchema = require("../middlewares/validator");
const authenticateToken = require("../middlewares/authMiddleware");
const auctionCategorySchema = require("../middlewares/validationSchema/auctioncategory");

const auctionCategoryRouter = express.Router();

auctionCategoryRouter.post('/create', validateSchema(auctionCategorySchema), auctionCategoryController.createAuctionCategory);
auctionCategoryRouter.get('/', authenticateToken, auctionCategoryController.allAuctionCategory);

module.exports = auctionCategoryRouter;