require("dotenv").config();

const express = require("express");
const cors = require("cors");

const corsOptions = require("./config/corsOptions");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Existing course route mount (kept as-is):
app.use("/api/v1/courses", courseRoutes);

// New authentication route mount:
app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
