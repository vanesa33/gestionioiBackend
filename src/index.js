const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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

// CORS: dominios permitidos
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestionioi-front.vercel.app",
  "https://gestionioi-front-git-main-vanesols-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (ej: Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqueado para:", origin);
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true
}));

// Manejo de preflight (OPTIONS)
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

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