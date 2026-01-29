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

router.get('/api/tasks', verifyTokenUser, getAllClient);

router.get('/api/tasks/:id', verifyTokenUser, getClient);

router.post('/api/tasks', verifyTokenUser, createClient);

router.delete('/api/tasks/:id', verifyTokenUser, deleteTask);

router.put('/api/tasks/:id', verifyTokenUser, upDateTask);

//ingreso por usuario//

router.get("/api/ingresos/user", verifyTokenUser, getAllIngresoByUser);

// *** Ingreso ** //

router.get("/api/ingresos/poruser/:id", verifyTokenUser, getAllIngresosSinFiltro );

router.get("/api/ingresos/todos", verifyTokenUser, getAllIngresosSinFiltro);

router.get('/api/ingresos', verifyTokenUser, getAllIngreso);

router.get('/api/ingresos/:id', verifyTokenUser, getIngreso);

router.post('/api/ingresos', verifyTokenUser, createIngreso);

router.delete('/api/ingresos/:id', verifyTokenUser, deleteIngreso);

router.put('/api/ingresos/:id', verifyTokenUser,  updateIngreso);

// *** orden *** //


router.get('/api/orden',  verifyTokenUser, getAllOrden);

router.get('/api/orden/:id', verifyTokenUser, getOrden);

router.post('/api/orden', verifyTokenUser, createOrden);

router.delete('/orden/:id', verifyTokenUser, deleteOrden);

router.put('/api/orden/:id',  verifyTokenUser, updateOrden);



module.exports = router;
