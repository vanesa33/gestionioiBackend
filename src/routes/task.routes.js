const { Router } = require ('express');
const { verifyTokenUser, verifyAdmin, verifyTecnico}  = require ('../middlewares/jkt.middleware.js');

const {getAllIngresoByUser, getAllIngresosSinFiltro} = require('../controllers/task.controllers.js')

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

router.get('/tasks', verifyTokenUser, getAllClient);

router.get('/tasks/:id', verifyTokenUser, getClient);

router.post('/tasks', verifyTokenUser, createClient);

router.delete('/tasks/:id', verifyTokenUser, deleteTask);

router.put('/tasks/:id', verifyTokenUser, upDateTask);

//ingreso por usuario//

router.get("/ingresos/user", verifyTokenUser, getAllIngresoByUser);

// *** Ingreso ** //

router.get("/ingresos/poruser/:id", verifyTokenUser, getAllIngresosSinFiltro );

router.get("/ingresos/todos", verifyTokenUser, getAllIngresosSinFiltro);

router.get('/ingresos', verifyTokenUser, getAllIngreso);

router.get('/ingresos/:id', verifyTokenUser, getIngreso);

router.post('/ingresos', verifyTokenUser, createIngreso);

router.delete('/ingresos/:id', verifyTokenUser, deleteIngreso);

router.put('/ingresos/:id', verifyTokenUser,  updateIngreso);

// *** orden *** //


router.get('/api/orden',  verifyTokenUser, getAllOrden);

router.get('/api/orden/:id', verifyTokenUser, getOrden);

router.post('/api/orden', verifyTokenUser, createOrden);

router.delete('/orden/:id', verifyTokenUser, deleteOrden);

router.put('/api/orden/:id',  verifyTokenUser, updateOrden);



module.exports = router;
