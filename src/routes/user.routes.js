const { Router } = require('express');
const { register, login, profile, logout, getAllUsers, getUsers, verifyToken } = require('../controllers/user.controller.js');
const { verifyTokenUser, verifyAdmin, verifyTecnico, verifyFactura } = require('../middlewares/jkt.middleware.js');
const { getAllRoles, getRol, createRol, deleteRol, updateRoles } = require('../controllers/task.controllers.js');
const { validateSchema } = require('../middlewares/validator.middleware.js')
const { registerSchema, loginSchema } = require('../schemas/auth.schema.js')


const { pool } = require('../db.js');
//const { verifyTokenRequest } = require('../../client/src/api/auth.js');


const router = Router();

// api/user

//router.post('/register', validateSchema(registerSchema), register)
router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.get('/profile', verifyTokenUser, verifyTecnico, profile);

router.get('/users', verifyToken, getAllUsers)
router.get('/usuarios', verifyToken, getAllUsers)
router.get('/user/:id', verifyToken,  getUsers)
router.post('/logout', logout);
router.post('/verify', verifyToken)

// api/admin    

router.get('/api/roles', verifyToken, verifyAdmin, getAllRoles);

router.get('/api/rol/:id', verifyToken, verifyAdmin, getRol);

router.post('/api/rol', verifyToken, verifyAdmin, createRol);

router.delete('/api/rol/:id', verifyToken, verifyAdmin, deleteRol);

router.put('/api/rol/:id', verifyToken, verifyAdmin, updateRoles);


module.exports = router;