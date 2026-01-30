const { Router } = require ('express');
const { verifyTokenUser, verifyAdmin, verifyTecnico}  = require ('../middlewares/jkt.middleware.js');

const {getAllIngresoByUser, getAllIngresosSinFiltro} = require('../controllers/task.controllers.js')

const {verifyToken} = require ('../controllers/user.controllers.js');

const { getAllIngreso,
        getIngreso,
        createIngreso,
        deleteIngreso,
        updateIngreso,

        getAllClient, 
        getClient,
        createClient,
        deleteTask,
        upDateTask,

        getAllOrden,
        getOrden,
        createOrden,
        deleteOrden,
        updateOrden
      } = require('../controllers/task.controllers'); 
     

const router = Router();


router.get('/', verifyTokenUser)

//  ***   roles *** //



// ***  client  *** //

router.get('/tasks', verifyToken, verifyTokenUser, getAllClient);

router.get('/tasks/:id', verifyToken, verifyTokenUser, getClient);

router.post('/tasks', verifyToken, verifyTokenUser, createClient);

router.delete('/tasks/:id', verifyToken, verifyTokenUser, deleteTask);

router.put('/tasks/:id', verifyToken, verifyTokenUser, upDateTask);

//ingreso por usuario//

router.get("/ingresos/user", verifyToken, verifyTokenUser, getAllIngresoByUser);

// *** Ingreso ** //

router.get("/ingresos/poruser/:id", verifyToken, verifyTokenUser, getAllIngresosSinFiltro );

router.get("/ingresos/todos", verifyToken, verifyTokenUser, getAllIngresosSinFiltro);

router.get('/ingresos', verifyToken, verifyTokenUser, getAllIngreso);

router.get('/ingresos/:id', verifyToken, verifyTokenUser, getIngreso);

router.post('/ingresos', verifyToken, verifyTokenUser, createIngreso);

router.delete('/ingresos/:id', verifyToken, verifyTokenUser, deleteIngreso);

router.put('/ingresos/:id', verifyToken, verifyTokenUser,  updateIngreso);

// *** orden *** //


router.get('/api/orden',  verifyTokenUser, getAllOrden);

router.get('/api/orden/:id', verifyTokenUser, getOrden);

router.post('/api/orden', verifyTokenUser, createOrden);

router.delete('/orden/:id', verifyTokenUser, deleteOrden);

router.put('/api/orden/:id',  verifyTokenUser, updateOrden);



module.exports = router;
