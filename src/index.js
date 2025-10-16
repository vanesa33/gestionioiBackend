const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRouter = require('./routes/user.routes.js');
const taskRoutes = require('./routes/task.routes.js');

const app = express();

// Middlewares
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS robusto
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestionioi-front.vercel.app",
  "https://gestionioi-front-git-main-vanesols-projects.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204); // responder preflight correctamente
    }
    return next();
  } else {
    return res.status(403).send("CORS blocked");
  }
});

// Rutas
app.use("/api", userRouter);
app.use("/api", taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});