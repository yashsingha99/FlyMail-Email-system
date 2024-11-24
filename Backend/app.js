const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongodb = require("mongodb");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*"
  })
);

const multer = require("multer");
const path = require("path");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("media"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl, message: "File uploaded successfully" });
});

// Serve static files from 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// routers...
const userRouter = require('./src/routes/user.routes');
const emailRouter = require('./src/routes/email.routes');
app.use('/api/user', userRouter);   //user routers
app.use('/api/email', emailRouter);   //email routers
module.exports = app;