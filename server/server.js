require("dotenv").config();
console.log(
  "Gemini Key:",
  process.env.GEMINI_API_KEY?.substring(0, 8)
);
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const analyzePDF = require("./gemini");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage });

// ============================
// Home Route
// ============================

app.get("/", (req, res) => {

    res.send("Synapse Backend Running 🚀");

});

// ============================
// Upload Route
// ============================

app.post("/upload", upload.single("pdf"), async (req, res) => {

    try {

        console.log("📄 PDF Uploaded");

        const pdfBuffer = fs.readFileSync(req.file.path);

        console.log("📖 Reading PDF...");

        const data = await pdfParse(pdfBuffer);

        console.log("✅ PDF Parsed Successfully");

        console.log("🤖 Sending to Gemini...");

   const aiResponse = JSON.stringify({
  title: "Demo Knowledge Graph",
  concepts: [
    {
      id: 1,
      name: "Artificial Intelligence",
      summary: "Artificial Intelligence enables machines to perform tasks that normally require human intelligence.",
      related: [2, 3]
    },
    {
      id: 2,
      name: "Machine Learning",
      summary: "Machine Learning is a branch of AI that learns patterns from data.",
      related: [1, 3]
    },
    {
      id: 3,
      name: "Neural Networks",
      summary: "Neural Networks are computing models inspired by the human brain.",
      related: [1, 2]
    },
    {
      id: 4,
      name: "Deep Learning",
      summary: "Deep Learning uses multiple neural network layers for complex learning.",
      related: [2, 3]
    },
    {
      id: 5,
      name: "Data",
      summary: "Data is the foundation for training AI and machine learning models.",
      related: [2, 4]
    }
  ]
});
            console.log("✅ Gemini Response Received");


console.log(aiResponse);

const cleanGraph = aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

console.log("Sending response...");

res.json({
    success: true,
    graph: JSON.parse(cleanGraph)
});

console.log("Response sent");

  
    }

    catch (error) {

        console.error("❌ ERROR:");

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

// ============================

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});