require ('dotenv').config();
const bcryptjs = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const { pool } = require('../db.js');
const { UserModel } = require ('../models/user.model.js');

const { promisify} = require("util");
const verify = promisify(jwt.verify);

const TOKEN_SECRET = process.env.JWT_SECRET;

const getUsers = async (req, res, next) => {
    try {
     
     const {id} = req.params
 
     const result = await pool.query('SELECT * FROM users WHERE ruid = $1', [id])
  
     if (result.rows.length === 0)
       return res.status(404).json({
         message: 'Task not found',
         
     });
  
     return  res.json(result.rows[0]);
 
    } catch (error) {
 
     next(error)
     
    }
    
 };


 const getAllUsers = async (req, res, next) => {    

    try
    {
     const allUser = await pool.query('SELECT * FROM users') 
     console.log("entro a getAllUsers");
     res.json(allUser.rows)
    } catch (error){
       next(error)
    }
    }; 

 /*const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Sequelize
    // const users = await User.find(); // si usas Mongoose
    res.json(users); // 🔥 devuelve un array, no un objeto con msg
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};*/

const register = async(req, res) => {
    try {
        
        const {username, email, password, role} = req.body;
        
         if(!username || !email || !password || !role){
            return res.status(400).json({ok: false, msg: "Missing required fields: email, password, username"});
         }

         const result = await pool.query('SELECT rid FROM roles WHERE name = $1', [role]);
         if(result.rows.length === 0){
             return res.status(400).json({ ok: false, msg: "Rol no valido"});
         }

         const role_id = result.rows[0].rid;

        

         //const userFound = await User.findOne({email}); 
        //if (userFound) return res.status(400).json();
        console.log("body recibido en:", req.body);
        if(!req.body){
            return res.status(400).json({ msg: "No se recibio ningun body"});
        }
     //*//
         const user = await UserModel.findOneEmail(email);
         if (user) 
            return res.status(400).json(["The email already exists"]);
         

         const salt = await bcryptjs.genSalt(10);
         const hashedPassword = await bcryptjs.hash(password, salt);


        const userData = {email, password: hashedPassword, username, role_id};
        console.log("enviado a create user", userData);

         const newUser = await UserModel.createUser(userData);

         const token = jwt.sign({
           id: newUser.id, email: newUser.email, role_id: newUser.role_id
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "1h"
         }

        )

        return res.json({ok: true, token,
            user: {
                id: newUser.id,
                name: newUser.username,
                email: newUser.email
            }
        }); 

    } catch (error) {
        console.error("Error en register:", error.message);
        return res.status(500).json({
        ok:false,
        msg:"error server"
    });
}
};






const login = async(req, res) => {
    try {

        const {email, password} = req.body;

        if(!email || !password ){
            return res
            .status(400)
            .json({ error: "Mising required fields: email, password"});
        }

        const user = await UserModel.findOneEmail(email)
        console.log("datos recibidos", req.body)
        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        const isMatch = await bcryptjs.compare(password, user.password)
        console.log("contraseña valida?", isMatch);

        if(!isMatch){
            return res.status(401).json({ error: "Invalid credentials"});
        }

        const token = jwt.sign(
            {id: user.ruid, email: user.email, role_id: user.role_id},        
         process.env.JWT_SECRET,
         {
            expiresIn: "1h"
         }

        );

        res.cookie('token', token, {
            httpOnly: true,
           // secure: false,
           secure: process.env.NODE_ENV === 'production',
            //sameSite: 'Lax',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 3600000
        });

        res.status(200).json({ user });

        res.json({
            ok: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

       // return res.json({ok: true, msg: 'login exitoso'});

       // return res.json({ ok: true, msg: token})


    } catch (err) {
        console.error("error en login:", err.message)
       /* return res.status(500).json({
        ok:false,
        msg:"error server"
    })*/
}
};

const profile = async(req, res) => {

    try {

        const user = await UserModel.findOneEmail(req.email)
        console.log("datos recibidos", req.body)

        return res.json({ok: true, msg: user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "error server"
        })
    }
}

const logout = (req, res) => {

    res.clearCookie("token");
  
    return res.sendStatus(200);

}

const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({ message: "Unauthorized"});
    }

jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    
    if (err) {
        return res.status(401).json({ message: "Unauthorized"});
        
    }

    try{

    const userFound = await UserModel.findOneEmail(decoded.email)
    if (!userFound){
         return res.status(401).json({ message: "Unauthorized"});
    }
    res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 3600000
            
        });

    return res.json({
        ok: true,
        msg: "token vlaido",
        user: {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email
        },
        ok: true,
        msg: 'Token Valido',
    });
     
    } catch (e) {
        console.error("error en verifyToken:", e.message);
        return res.status(500).json({ message: "internal server error"});
    }

    
});    
};


module.exports = { 
    getUsers,
    getAllUsers,
    register,
    login,
    profile, 
    logout,
    verifyToken,
    verify
};


