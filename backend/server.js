const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");

// Config .env to
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
dotenv.config();

// connect to database
connectDB();

const app = express();
app.use(express.json());

// Config bodyParser
// app.use(bodyParser.json());

// Config for only development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

//load all routes
app.use("/api/", authRoute);
app.use("/api/", userRoute);
app.use("/api/", postRoute);
app.use("/api/upload", uploadRoutes);

__dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// for bulid floder run = npm run build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Founded",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
