const { Op } = require("sequelize");
const Auction = require("../../models/auction");
const { ERROR_MESSAGE } = require("../../utils/propertyResolver");
const Bid = require("../../models/bid");
const Users = require("../../models/user");

const saveBid = async (bidInfo) => {
  try {
    const { userId, auction_id, bid_amount } = bidInfo;
    const currentDate = new Date();
    // Fetch auction details
    const auction = await Auction.findOne({
      where: {
        id: auction_id,
        status: "active",
        end_date: {
          [Op.gt]: currentDate,
        },
      },
    });

    if (!auction) {
      throw new Error(ERROR_MESSAGE.AUCTION_NOT_FOUND);
    }

    // Check if the  use is bidding on their own auction
    if (auction.created_by === userId) {
      throw new Error(ERROR_MESSAGE.CANNOT_BID_OWN_AUCTION);
    }

    // bid amount always > base amt
    if (bid_amount < auction.base_price) {
      throw new Error(ERROR_MESSAGE.BID_AMT_LESS);
    }

    // is bid present
    const isBid = await Bid.findOne({
      where: {
        user_id: userId,
        auction_id: auction_id,
      },
    });

    if (isBid) {
      throw new Error(ERROR_MESSAGE.BID_ALREADY_APPLIED);
    }

    // create the bid
    const bid = await Bid.create({
      user_id: userId,
      auction_id,
      bid_amount,
      bid_status: "pending",
      created_by: userId,
    });
    return bid;
  } catch (error) {
    throw new Error(error.message);
  }
};

const myBidList = async (filter) => {
  try {
    const {
      page,
      limit,
      sortBy = "desc",
      minBidAmount,
      maxBidAmount,
      status,
      search,
      userId,
    } = filter;
    const offset = (page - 1) * limit;

    //Auction Filter
    const auctionWhere = {};

    //Search Filter
    if (search) {
      auctionWhere[Op.or] = [
        {
          item_name: { [Op.like]: `%${search}%` },
        },
        {
          description: { [Op.like]: `%${search}%` },
        },
      ];
    }

    //Bid Filter
    const bidWhere = {
      user_id: userId,
    };

    // Min bid amount filter
    if (minBidAmount) {
      bidWhere.bid_amount = {
        [Op.gte]: parseFloat(minBidAmount),
      };
    }

    // Max bid amount filter
    if (maxBidAmount) {
      bidWhere.bid_amount = {
        ...bidWhere.bid_amount,
        [Op.lte]: parseFloat(maxBidAmount),
      };
    }

    // Filter by multiple status
    if (Array.isArray(status) && status.length > 0) {
      bidWhere.bid_status = { [Op.in]: status };
    }

    const { rows: auctions, count: total } = await Auction.findAndCountAll({
      where: auctionWhere,
      include: [
        {
          model: Bid,
          where: bidWhere,
          as: "bids",
          required: true, // Ensure only auction where user has bid are return
        },
        {
          model: Users,
          as: "creator",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
      limit,
      offset,
      order: [["created_at", sortBy === "asc" ? "ASC" : "DESC"]],
    });

    return {
      auctions,
      pagination: {
        total, // total record
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { saveBid, myBidList };