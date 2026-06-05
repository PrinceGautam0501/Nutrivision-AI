import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import { useState, useEffect } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [foods, setFoods] = useState([]);

  const totalFoods = foods.length;

const totalCalories = foods.reduce(
  (sum, food) => sum + food.calories,
  0
);

const totalProtein = foods.reduce(
  (sum, food) => sum + food.protein,
  0
);

let healthTip = "";

if (totalCalories > 2500) {
  healthTip =
    "⚠️ High calorie intake detected. Consider lighter meals and more physical activity.";
}
else if (totalProtein > 100) {
  healthTip =
    "💪 Excellent protein intake. Great for muscle maintenance and recovery.";
}
else {
  healthTip =
    "✅ Your nutrition looks balanced. Keep maintaining healthy eating habits.";
}

const chartData = [
  {
    name: "Protein",
    value: totalProtein,
  },
  {
    name: "Carbs",
    value: foods.reduce(
      (sum, food) => sum + food.carbs,
      0
    ),
  },
  {
    name: "Fat",
    value: foods.reduce(
      (sum, food) => sum + food.fat,
      0
    ),
  },
];

const COLORS = [
  "#00E676",
  "#2196F3",
  "#FF9800",
];
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [aiInsight, setAiInsight] =
  useState("");

  const [search, setSearch] = useState("");

  const userInfo = JSON.parse(
  localStorage.getItem("user")
);


useEffect(() => {
  fetchFoods();
  fetchInsight();
}, []);
const fetchFoods = async () => {
  try {
    const userInfo = JSON.parse(
      localStorage.getItem("user")
    );

    const token = userInfo?.token;

    const { data } = await axios.get(
      "http://localhost:5000/api/food",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   setFoods(data.reverse());

  } catch (error) {
    console.log(error);
  }
};


const fetchInsight = async () => {
  try {

    const userInfo = JSON.parse(
      localStorage.getItem("user")
    );

    const token = userInfo?.token;

    const { data } = await axios.get(
      "http://localhost:5000/api/food/insight",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAiInsight(data.insight);

  } catch (error) {

    console.log(error);

  }
};

const deleteFoodHandler = async (id) => {
  try {

    const userInfo = JSON.parse(
      localStorage.getItem("user")
    );

    const token = userInfo?.token;

    await axios.delete(
      `http://localhost:5000/api/food/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchFoods();
    fetchInsight();

  } catch (error) {

    console.log(error);

  }
};


const downloadPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "NutriVision Nutrition Report",
    14,
    20
  );

  const tableData = foods.map(
    (food) => [
      food.foodName,
      food.calories,
      food.protein,
      food.carbs,
      food.fat,
    ]
  );

  autoTable(doc, {
    startY: 35,
    head: [[
      "Food",
      "Calories",
      "Protein",
      "Carbs",
      "Fat",
    ]],
    body: tableData,
  });

  doc.save(
    "NutriVision_Report.pdf"
  );
};

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const userInfo = JSON.parse(
  localStorage.getItem("user")
);

const token = userInfo?.token;
      console.log("TOKEN =", token);

      const { data } = await axios.post(
        "http://localhost:5000/api/food/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFoodData(data);
      fetchFoods();
      fetchInsight();

      setLoading(false);

    } catch (error) {
  console.log(error);

  console.log("ERROR RESPONSE:");
  console.log(error.response);

  alert(
    error.response?.data?.message ||
    error.message
  );

  setLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

   <div className="mb-10">

   <div className="grid md:grid-cols-4 grid-cols-2 gap-5 mb-8">

        <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">

  <h3 className="text-gray-400">
    User
  </h3>

  <p className="text-3xl font-bold text-green-400">
    {userInfo?.name}
  </p>

</div>

  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
    <h3 className="text-gray-400">
      Foods Analyzed
    </h3>

    <p className="text-3xl font-bold text-green-400">
      {totalFoods}
    </p>
  </div>

  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
    <h3 className="text-gray-400">
      Total Calories
    </h3>

    <p className="text-3xl font-bold text-orange-400">
      {totalCalories}
    </p>
  </div>

  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
    <h3 className="text-gray-400">
      Total Protein
    </h3>

    <p className="text-3xl font-bold text-blue-400">
      {totalProtein}g
    </p>
  </div>

</div>

<div>

 <div>

<h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
  NutriVision Dashboard
</h1>

  <p className="text-xl mt-3 text-slate-300">
    Welcome, {userInfo?.name} 👋

    <div className="flex gap-6 mt-4 flex-wrap">

  <span className="text-orange-400">
    🔥 {totalCalories} Calories
  </span>

  <span className="text-blue-400">
    💪 {totalProtein}g Protein
  </span>

  <span className="text-cyan-400">
    🍞 {foods.reduce((sum, food) => sum + food.carbs, 0)}g Carbs
  </span>

  <span className="text-yellow-400">
    🥑 {foods.reduce((sum, food) => sum + food.fat, 0)}g Fat
  </span>

</div>


  </p>

  <button
    onClick={downloadPDF}
   className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold shadow-lg hover:scale-105 transition-all duration-300"
  >
    Download Report
  </button>

</div>



</div>

  <button
    onClick={() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    }}
   className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 font-semibold shadow-lg hover:scale-105 transition-all duration-300"
  >
    Logout
  </button>

</div>
<div className="flex gap-8 items-start flex-wrap">

  <div
  className="
  bg-slate-800/70
  backdrop-blur-md
  border
  border-slate-700
  p-8
  rounded-2xl
  shadow-lg
  w-[550px]
  transition-all
  duration-300
  hover:border-green-400
"
>

  <h2 className="text-2xl font-bold mb-6 text-green-400">
    📸 Upload Food Image
  </h2>

  <input
    type="file"
    className="
      w-full
      p-3
      rounded-lg
      bg-slate-900
      border
      border-slate-700
      cursor-pointer
    "
    onChange={(e) => {
      setImage(e.target.files[0]);

      setPreview(
        URL.createObjectURL(
          e.target.files[0]
        )
      );
    }}
  />

  {preview && (
    <div className="mt-6">

      <img
        src={preview}
        alt="food"
        className="
          w-full
          h-72
          object-cover
          rounded-xl
          border
          border-slate-700
        "
      />

    </div>
  )}

  <button
    onClick={handleAnalyze}
    className="
      mt-6
      w-full
      py-3
      rounded-xl
      font-semibold
      bg-gradient-to-r
      from-green-500
      to-emerald-400
      hover:scale-105
      transition-all
      duration-300
    "
  >
    {loading
 ? <div className="flex justify-center items-center gap-2">

  <div
    className="
      w-5 h-5
      border-2
      border-white
      border-t-transparent
      rounded-full
      animate-spin
    "
  />

  <span>
    AI Analyzing...
  </span>

</div>
 : "🚀 Analyze Food"}
  </button>

</div>

{foodData && (
  <div
    className="
      bg-slate-800/70
      backdrop-blur-md
      border
      border-slate-700
      p-8
      rounded-2xl
      shadow-lg
      w-[420px]
    "
  >

    <h2 className="text-2xl font-bold text-green-400 mb-6">
      📊 Nutrition Result
    </h2>

    <div className="space-y-4 text-lg">

      <p>
        🍽️ Food:
        <span className="font-bold ml-2">
          {foodData.foodName}
        </span>
      </p>

      <p>
        🔥 Calories:
        <span className="text-orange-400 ml-2">
          {foodData.calories}
        </span>
      </p>

      <p>
        💪 Protein:
        <span className="text-blue-400 ml-2">
          {foodData.protein} g
        </span>
      </p>

      <p>
        🍞 Carbs:
        <span className="text-cyan-400 ml-2">
          {foodData.carbs} g
        </span>
      </p>

      <p>
        🥑 Fat:
        <span className="text-yellow-400 ml-2">
          {foodData.fat} g
        </span>
      </p>

    </div>

  </div>
)}

    </div>
 <div className="mt-10">


<div className="mt-10">

  <h2 className="text-3xl font-bold text-green-400 mb-5">
    Nutrition Analytics
  </h2>

 <div className="flex gap-8 items-start">

    <div className="bg-slate-800 p-6 rounded-xl">

    <PieChart
      width={400}
      height={300}
    >

      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {chartData.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />
          )
        )}
      </Pie>

      <Tooltip />
      <Legend />

</PieChart>

</div>

<div
  className="
  bg-slate-800/70
  backdrop-blur-md
  border border-slate-700
  p-6
  rounded-xl
  shadow-lg
  w-[350px]
  "
>

  <h3 className="text-2xl font-bold text-green-400 mb-5">
    Nutrition Summary
  </h3>

  <div className="space-y-4">

    <div className="flex justify-between">
      <span>🔥 Calories</span>
      <span className="font-bold text-orange-400">
        {totalCalories}
      </span>
    </div>

    <div className="flex justify-between">
      <span>💪 Protein</span>
      <span className="font-bold text-blue-400">
        {totalProtein} g
      </span>
    </div>

    <div className="flex justify-between">
  <span>🍞 Carbs</span>
  <span className="font-bold text-cyan-400">
    {foods.reduce(
      (sum, food) => sum + food.carbs,
      0
    )} g
  </span>
</div>

<div className="flex justify-between">
  <span>🥑 Fat</span>
  <span className="font-bold text-orange-400">
    {foods.reduce(
      (sum, food) => sum + food.fat,
      0
    )} g
  </span>
</div>

    <div className="flex justify-between">
      <span>🍽 Foods</span>
      <span className="font-bold text-green-400">
        {totalFoods}
      </span>
    </div>

    <div className="flex justify-between">
      <span>📊 Status</span>
      <span className="font-bold text-yellow-400">
        {totalCalories > 2500
          ? "High Calories"
          : "Balanced"}
      </span>
    </div>

  </div>

</div>

</div>

</div>


<div className="mt-10">

 <h2 className="text-3xl font-bold text-green-400 mb-5">
  AI Health Insight
</h2>

<div
  className="
    bg-slate-800/70
    backdrop-blur-md
    border
    border-slate-700
    p-6
    rounded-2xl
    shadow-lg
  "
>

 <div className="flex gap-4 items-start">

  <span className="text-3xl">
    🤖
  </span>

  <p className="text-lg leading-relaxed">
    {aiInsight}
  </p>

</div>

  <p
    className={`font-semibold mt-4 ${
      totalCalories > 2500
        ? "text-red-400"
        : "text-green-400"
    }`}
  >
    Risk Level:
    {totalCalories > 2500
      ? " High Calories ⚠️"
      : " Healthy Range ✅"}
  </p>

</div>

</div>
  <div className="flex items-center gap-4 mb-5">

  <h2 className="text-3xl font-bold text-green-400">
    Food History
  </h2>

  <span
    className="
      px-3 py-1
      rounded-full
      bg-green-500/20
      text-green-400
      text-sm
    "
  >
    {totalFoods} Foods
  </span>

</div>

  <input
  type="text"
  placeholder="Search Food..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="bg-slate-800 p-3 rounded-lg w-full mb-5"
/>

  <div className="grid gap-4">

   {foods
  .filter((food) =>
    food.foodName
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
  .map((food) => (
        
      <div
  key={food._id}
  className="
bg-slate-800/70
backdrop-blur-md
border border-slate-700
p-5
rounded-xl
flex gap-6 items-center
shadow-lg
hover:scale-[1.02]
hover:border-green-500
transition-all duration-300
"
>

  <img

  src={`http://localhost:5000/${food.imageUrl.replace(/\\/g, "/")}`}
  alt={food.foodName}
  className="
w-40 h-40
object-cover
rounded-xl
border-2 border-slate-700
"
/>

  <div>
    <h3 className="text-xl font-bold">
      {food.foodName}
    </h3>

    

<div className="flex gap-3 flex-wrap mt-3">

  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
    🔥 {food.calories} Cal
  </span>

  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
    💪 {food.protein}g
  </span>

  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
    🍞 {food.carbs}g
  </span>

  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
    🥑 {food.fat}g
  </span>

</div>

<button
  onClick={() =>
    deleteFoodHandler(food._id)
  }
  className="
mt-4
px-5 py-2
rounded-lg
bg-gradient-to-r
from-red-500
to-pink-500
font-semibold
hover:scale-105
transition-all duration-300
"
>
  Delete
</button>
  </div>

</div>
    ))}

  </div>

</div>
    </div>
  );
}

export default Dashboard;