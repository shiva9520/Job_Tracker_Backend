const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Job Tracker API Running");
});

module.exports = app;