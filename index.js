const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for image upload (Using /tmp/ for Vercel compatibility)
const storage = multer.diskStorage({
  destination: "/tmp/", // ✅ Use /tmp/ since Vercel allows writing only here
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension (.jpg, .png, etc.)
    const filename = `${Date.now()}${ext}`; // Generate unique filename
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Endpoint to handle image upload and prediction
app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = path.join("/tmp/", req.file.filename); // ✅ Updated to use /tmp/
  const modelPath = path.join(__dirname, "best.pt");

  // Run Python script for prediction
  const pythonProcess = spawn("python3", [
    "predict.py",
    "--image",
    imagePath,
    "--model",
    modelPath,
  ]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);

    // Delete image after processing
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete image:", err);
    });

    try {
      console.log(JSON.parse(result));
      res.json(JSON.parse(result)); // Parse JSON response
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Invalid response from Python script" });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Configure multer for image upload (Preserving File Extension)
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".")[1]; // Get file extension (.jpg, .png, etc.)
//     const filename = Date.now() + "." + ext; // Generate unique filename
//     cb(null, filename);
//   },
// });
// const upload = multer({ storage });

// // Endpoint to handle image upload and prediction
// app.post("/predict", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No image uploaded" });
//   }

//   const imagePath = path.join(__dirname, "uploads", req.file.filename);
//   const modelPath = path.join(__dirname, "best.pt");

//   // Run Python script for prediction
//   const pythonProcess = spawn("python", [
//     "predict.py",
//     "--image",
//     imagePath,
//     "--model",
//     modelPath,
//   ]);

//   let result = "";
//   pythonProcess.stdout.on("data", (data) => {
//     result += data.toString();
//   });

//   pythonProcess.stderr.on("data", (data) => {
//     console.error(`Error: ${data}`);
//   });

//   pythonProcess.on("close", (code) => {
//     console.log(`Python script exited with code ${code}`);

//     // Delete image after processing
//     fs.unlink(imagePath, (err) => {
//       if (err) console.error("Failed to delete image:", err);
//     });

//     try {
//       console.log(JSON.parse(result));
//       res.json(JSON.parse(result)); // Parse JSON response
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Invalid response from Python script" });
//     }
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
