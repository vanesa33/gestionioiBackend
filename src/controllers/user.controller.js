require ('dotenv').config();
const bcryptjs = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const { pool } = require('../db.js');
const { UserModel } = require ('../models/user.model.js');
const bcrypt = require('bcrypt');

const { promisify} = require("util");
const { c, u } = require('tar');
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

 /*const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    return res.json(users); // 👈 ARRAY PURO
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error server" });
  }
};
*/
const getAllUsers = async (req, res) => {
  try {
    console.log("entro a getAllUsers controller");
    const result = await pool.query(`
      SELECT ruid,
      username, 
      email, 
      role_id,
      r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.rid
      ORDER BY role_id, username
    `);

    res.json({
      ok: true, 
      users: result.rows});
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};


 /*const getAllUsers = async (req, res, next) => {    

    try
    {
     const allUser = await pool.query('SELECT * FROM users') 
     console.log("entro a getAllUsers");
     res.json(allUser.rows)
    } catch (error){
       next(error)
    }
    }; */

/*const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();

    res.json({
      ok: true,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};*/

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
         
           console.log("usuario logueado", user);

        const token = jwt.sign(
            {id: user.ruid, email: user.email, role_id: user.role_id},        
         process.env.JWT_SECRET,
         {
            expiresIn: "1h"
         }

        );


       

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 3600000
        });


        if (user.must_change_password) {
            return res.json({
                ok: true,
                must_change_password: true,
                token,
                user: {
                    id: user.ruid,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id
                }
            });
        }

        res.json({
            ok: true,
            must_change_password: false,
            token,
            user: {
                id: user.ruid,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                must_change_password: user.must_change_password
            }
        })

       

    } catch (err) {
        console.error("error en login:", err.message)
       
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

const verifyToken = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      ok: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role_id: decoded.role_id,
      },
        
    });

      console.log("TOKEN HEADER:", req.headers.authorization);
      console.log("TOKEN COOKIE:", req.cookies?.token);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);



  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};



const resetPassword = async (req, res) => {
  try {
    const userIdToReset = Number(req.params.id);

    if (isNaN(userIdToReset)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    console.log("ID A RESETEAR:", userIdToReset);
    console.log("ADMIN LOGUEADO:", req.user.id);

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `UPDATE users
       SET password = $1,
           must_change_password = true
       WHERE ruid = $2
       RETURNING ruid, email, role_id`,
      [hashedPassword, userIdToReset]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      tempPassword,
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reseteando contraseña" });
  }
};
const resetPasswordUser = async (req, res) => {
  console.log("👉 Entró a resetPasswordUser");

  const userId = req.user.id; // 👈 del token
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Falta la nueva contraseña" });
  }

  try {

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `UPDATE users
       SET password = $1,
           must_change_password = false
       WHERE ruid = $2
       RETURNING ruid, username, email, role_id`,
      [passwordHash, userId]
    );
    console.log("Resultado de la actualización:", result);

    console.log("password recibida:", password);
    console.log("ID de usuario:", userId);
    console.log("password guardada:", passwordHash || password);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      message: "Contraseña actualizada correctamente",
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = Number(req.params.id);
    const result = await pool.query(
      `DELETE FROM users WHERE ruid = $1 RETURNING ruid`,
      [userIdToDelete]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role_id } = req.body;

    const result = await pool.query(
      `UPDATE users SET role_id = $1 WHERE ruid = $2 RETURNING ruid, username, email, role_id`,
      [role_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      message: "Rol actualizado correctamente",
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar rol del usuario" });
  }
};



module.exports = { 
    getUsers,
    getAllUsers,
    register,
    login,
    profile, 
    logout,
    verifyToken,
    verify, 
    resetPasswordUser,
    resetPassword,
    deleteUser,
    updateUserRole
    
};
