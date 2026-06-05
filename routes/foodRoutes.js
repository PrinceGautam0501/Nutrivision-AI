const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const { protect } = require("../middleware/authMiddleware");

const {
  uploadFoodImage,
  getFoods,
  deleteFood,
  getHealthInsight,
} = require("../controllers/foodController");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("image"),
  uploadFoodImage
);

router.get(
  "/",
  protect,
  getFoods
);

router.delete(
  "/:id",
  protect,
  deleteFood
);

router.get(
  "/insight",
  protect,
  getHealthInsight
);

module.exports = router;