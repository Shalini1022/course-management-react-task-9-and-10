// Allows the React (Vite) app to call this API from another port.
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
};

module.exports = corsOptions;
