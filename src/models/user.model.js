const {db} = require ('../config.js');
const {pool} = require ( '../db.js');


const getAllUsers = async (req, res, next) => {    

    try
    {
     const allUser = await pool.query('SELECT * FROM users') 
     res.json(allUser.rows)
    } catch (error){
       next(error)
    }
    };

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



     const createUser = async (data) => {
        if(!data || typeof data !== "object") {
            throw new Error("createUser recibio un valor invalido");
        }

        const {email, password, username, role_id} = data;
    
       try {
    
        const result = await pool.query(
            "INSERT INTO PUBLIC.users (email, password, username, role_id) VALUES ($1, $2, $3, $4) RETURNING email, password, username, ruid, role_id",
             [email, password, username, role_id]
            );
        
            return result.rows[0];
        
       } catch (error) {
         throw error;        
       }
    };
    

    const deleteUser = async (req, res, next) => {

        const { id } = req.params;
        
        try {
           const result = await pool.query('DELETE FROM users WHERE ruid = $1', [id]);
           
           if (result.rowCount === 0) 
               return res.status(404).json({
               message: "Task not found",
               });
       
           return res.sendStatus(204);
       } catch(error){
           next(error);
       }
       };

       const updateUser = async (req, res, next) => {
   
        try {
            const { id } = req.params;
        const { email, password, username, role_id } = req.body;
    
       const result = await pool.query('UPDATE users SET email = $1, password = $2, username = $3,  role_id = $4 WHERE ruid = $5 RETURNING *',
             [email, password, username, role_id, id]
            );
    
            if (result.rows.length === 0)
                return res.status(404).json({
                  message:"Task not found",
            });
    
            return res.json(result.rows[0])
        } catch (error) {
            next(error);
        }
    
    };

    const findOneEmail  = async (email) => {
       try {
        
        
            const result = await pool.query('SELECT * FROM users WHERE email = $1 ', [email]);
            return result.rows[0];   
         

       } catch (error) {
        throw error;
       }
    };

    const findAll = async (req, res) => {
        try {
            const users = await UserModel.findAll()
    
            return res.json({ ok: true, msg: users })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Error server'
            })
        }
    }

    module.exports = {

      UserModel: { 
        getAllUsers,
        getUsers,
        createUser,
        deleteUser,
        updateUser,
        findOneEmail
      }
    };