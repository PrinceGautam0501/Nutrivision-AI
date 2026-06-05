const {
  identifyFood,
} = require("../services/geminiService");

const Food = require("../models/Food");
const {
  analyzeFood,
  generateHealthInsight,
} = require("../services/nutritionService");

const uploadFoodImage = async (req, res) => {
  try {

    const result = await analyzeFood(
      req.file.path
    );

    const nutritionData = JSON.parse(result);

const food = await Food.create({
  imageUrl: req.file.path,
  foodName: nutritionData.foodName,
  calories: nutritionData.calories,
  protein: nutritionData.protein,
  carbs: nutritionData.carbs,
  fat: nutritionData.fat,

  user: req.user._id,
});

    res.status(201).json(food);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getFoods = async (req, res) => {
  try {

  const foods = await Food.find({
  user: req.user._id,
});

    res.json(foods);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


const deleteFood = async (req, res) => {
  try {

    const food = await Food.findById(
      req.params.id
    );

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    await food.deleteOne();

    res.json({
      message: "Food deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


const getHealthInsight = async (
  req,
  res
) => {
  try {

    const foods = await Food.find({
      user: req.user._id,
    });

    const insight =
      await generateHealthInsight(
        foods
      );

    res.json({
      insight,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  uploadFoodImage,
  getFoods,
  deleteFood,
  getHealthInsight,
};