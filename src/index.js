
const express = require('express');
const  morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {verifyToken} = require ('./controllers/user.controller.js')

require('dotenv').config();


const userRouter = require( './routes/user.routes.js');
const taskRoutes = require("./routes/task.routes.js");
const ingresoRoutes = require('./routes/task.routes.js');


const app = express();



app.use(cookieParser());

const allowedOrigins = [ 'http://localhost:5173', 
   "https://frontioi.netlify.app",
   "https://gestionioi-front.vercel.app", 
   'https://gestionioi-front-git-main-vanesols-projects.vercel.app', // rama Vercel"

];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://frontioi.netlify.app",
      "https://gestionioi-front.vercel.app",
      "https://gestionioi-front-git-main-vanesols-projects.vercel.app"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));



//app.use("/api", require("./routes/user.routes.js"));
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended:true}));


//const tasksRouter = require('./routes/task.routes.js');
//app.use("/api/ingreso", ingresoRoutes);

app.use("/", userRouter);
app.use("/", taskRoutes);

app.use((err, req, res, next) => {
     return res.json({
        message: err.message
     })
    });

app.listen(4000)
console.log('Server port 4000');
