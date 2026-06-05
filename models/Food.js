const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    foodName: {
      type: String,
      default: "",
    },

    calories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbs: {
      type: Number,
      default: 0,
    },

    fat: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);