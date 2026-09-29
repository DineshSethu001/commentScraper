const mongoose = require("mongoose");

const scrapeSessionSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ScrapeSession = mongoose.model(
  "ScrapeSession",
  scrapeSessionSchema
);

module.exports = ScrapeSession;