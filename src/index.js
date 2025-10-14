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
app.use(cors({
   origin: 'http://localhost:5173',
   credentials: true
}));



//app.use("/api", require("./routes/user.routes.js"));
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended:true}));


//const tasksRouter = require('./routes/task.routes.js');
//app.use("/api/ingreso", ingresoRoutes);

app.use("/api",userRouter);
app.use("/api",taskRoutes);

app.use((err, req, res, next) => {
     return res.json({
        message: err.message
     })
    });

app.listen(4000)
console.log('Server port 4000');