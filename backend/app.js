const express = require("express");
const cors = require("cors");
const schedulingRoutes = require("./routes/schedulingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// All scheduling routes
app.use("/api", schedulingRoutes);

module.exports = app;
