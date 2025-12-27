const {pool} = require ('../db.js');
const {taskRequired} = require ('../middlewares/jkt.middleware.js');
const { result } = require ('../models/task.model.js');
const { supabase } = require('../supabaseClient.js');
const { getNumeroVisual } = require('../orden.utils.js');

         ////////                    roles              ///////////

///////////////////   obtener todos los roles    /////////////////

const getAllRoles = async (req, res, next) => {    

    try
    {
     const allRoles = await pool.query('SELECT * FROM roles');  
     res.json(allRoles.rows)
    } catch (error){
       next(error)
    }
    };

////////////// obtener un rol  //////

const getRol = async (req, res, next) => {
    try {
     
     const {id} = req.params
 
     const result = await pool.query('SELECT * FROM roles WHERE rid = $1', [id])
  
     if (result.rows.length === 0)
       return res.status(404).json({
         message: 'Task not found',
         
     });
  
       res.json(result.rows[0]);
 
    } catch (error) {
 
     next(error)
     
    }
    
 };
 
// crear rol    //

const createRol = async (req, res, next) => {
    const {name} = req.body

   try {

    const result = await pool.query(
        "INSERT INTO roles ( roles ) VALUES ($1) RETURNING *",
         [ name]
        );
    
        res.json(result.rows[0])
    
   } catch (error) {
    next(error)
   }
};


/// eliminar rol ///

const deleteRol = async (req, res, next) => {

    const { id } = req.params
    
    try {
       const result = await pool.query('DELETE FROM roles WHERE rid = $1', [id]);
       
       if (result.rowCount === 0) 
           return res.status(404).json({
           message: "Task not found",
           });
   
       return res.sendStatus(204);
   } catch(error){
       next(error);
   }
   };


// actualiza roles   ////

const updateRoles = async (req, res, next) => {
   
    try {
        const { id } = req.params;
    const { name } = req.body;

   const result = await pool.query('UPDATE roles SET name = $1, rid = $2 RETURNING *',
         [name, id]
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


  

            ////////    clientes    /////////

////// obtener todos los clientes ////////

const getAllClient = async (req, res, next) => {    

try
{
 const allClient = await pool.query('SELECT * FROM client');  
 res.json(allClient.rows)
} catch (error){
   next(error)
}
};

//////// obtener cliente //////

const getClient = async (req, res, next) => {
   try {
    
    const {id} = req.params

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            message: 'Parámetro "id" inválido',
        });
    }

    const result = await pool.query('SELECT * FROM client WHERE id = $1', [id])
 
    if (result.rows.length === 0)
      return res.status(404).json({
        message: 'Task not found',
        
    });
 
      res.json(result.rows[0]);

   } catch (error) {

    next(error)
    
   }
   
};

//     crear cliente   ///

const createClient = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // 🔧 Limpiar campos vacíos -> null
    for (let key in req.body) {
      if (req.body[key] === "") req.body[key] = null;
    }

    const {
      nombre,
      apellido,
      calle,
      numero,
      piso,
      dto,
      provincia,
      localidad,
      codpost,
      telefono,
      mail,
    } = req.body;

    const numeroParsed = numero ? Number(numero) : null;
    const codpostParsed = codpost ? Number(codpost) : null;

    const result = await pool.query(
      `INSERT INTO client (
        nombre, apellido, calle, numero, piso, dto,
        provincia, localidad, codpost, telefono, mail, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        nombre,
        apellido,
        calle,
        numeroParsed,
        piso,
        dto,
        provincia,
        localidad,
        codpostParsed,
        telefono,
        mail,
        user_id,
      ]
    );

    res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("❌ Error en createClient:", error);
    next(error);
  }
};


/// delete   client   ////

const deleteTask = async (req, res, next) => {

 const { id } = req.params
 
 try {
    const result = await pool.query('DELETE FROM client WHERE id = $1', [id]);
    
    if (result.rowCount === 0) 
        return res.status(404).json({
        message: "Task not found",
        });

    return res.sendStatus(204);
} catch(error){
    next(error);
}
};


////  actualizar cliente /////

const upDateTask = async (req, res, next) => {
   
    try {
        const { id } = req.params;
    const { nombre, apellido, calle, numero, piso, dto, provincia, localidad, codpost, telefono, mail, } = req.body;

  const result = await pool.query(
  'UPDATE client SET nombre = $1, apellido = $2, telefono = $3, calle = $4, numero = $5, piso = $6, dto = $7, provincia = $8, localidad = $9, codpost = $10, mail = $11 WHERE id = $12 RETURNING *',
  [nombre, apellido, telefono, calle, numero, piso, dto, provincia, localidad, codpost, mail, id]
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

           ////////          ingreso        ///////

//             obtener todos los ingresos    ///

const getAllIngresoByUser = async (req, res, next) => {
  try {
    const user_id = req.user.id; // obtenido del token por el middleware

    const result = await pool.query(
      `SELECT ingreso.*, client.nombre, client.apellido, client.telefono, client.mail,
              client.calle, client.numero, client.piso, client.dto, client.provincia,
              client.localidad, client.codpost
       FROM ingreso
    INNER JOIN client ON ingreso.client_id = client.id
       WHERE client.user_id = $1`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getAllIngresosSinFiltro = async (req, res, next) => {
  try {
    //const user_id = req.user.id; // obtenido del token por el middleware

    const result = await pool.query(
      `SELECT ingreso.*, client.nombre, client.apellido, client.telefono, client.mail,
              client.calle, client.numero, client.piso, client.dto, client.provincia,
              client.localidad, client.codpost,
              users.username AS usuario_nombre
       FROM ingreso
    INNER JOIN client ON ingreso.client_id = client.id
    LEFT JOIN users ON ingreso.user_id = users.ruid
       ORDER BY ingreso.numorden DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};


/*const getAllIngreso = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    console.log("user id recibido", user_id);
    const res = await getIngresosRequest();
    console.log("📦 Datos traídos del backend:", res.data);
    setIngresos(res.data);
  } catch (error) {
    console.error("❌ Error al obtener ingresos", error);
  }
};*/


// 🔹 Todas las órdenes sin filtrar
/*const getAllIngresosSinFiltro = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ingreso., client.
       FROM ingreso
       JOIN client ON ingreso.client_id = client.id
       ORDER BY ingreso.iid DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}; */



const getAllIngreso = async (req, res, next) => {    
    const user_id = req.user.id;
    console.log("user id recibido", user_id)

    if (!user_id){
        return res.status(400).json({ message: "user_id is nor defined"});
    }

    try
    {
     const allIngreso = await pool.query(
        `SELECT DISTINCT ON (ingreso.iid) ingreso.*, client.*
         FROM ingreso
         JOIN client ON ingreso.client_id = client.id
         WHERE client.user_id = $1
         ORDER BY ingreso.iid`,
         [user_id]
    );  
     res.json(allIngreso.rows);
    } catch (error){
       next(error);
    }
    }; 


    ///           obtener ingreso    /////


const getIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        ingreso.*,
        client.nombre,
        client.apellido,
        client.telefono,
        client.direccion
      FROM ingreso
      JOIN client ON ingreso.client_id = client.id
      WHERE ingreso.iid = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/////          crear ingreso    /////////


const createIngreso = async (req, res, next) => {
  try {
    let {
      client_id,
      equipo,
      falla,
      observa,
      fecha,
      nserie,
      costo,
      imagenurl,
      repuesto,
      manoobra,
      total,
      iva,
      presu,
      salida,
      tipo_orden
    } = req.body;

    const userId = req.user?.id || null;

    // 🔹 Normalizar tipo_orden a minúscula y eliminar espacios
    if (tipo_orden) {
      tipo_orden = tipo_orden.toLowerCase().trim();
    }

    // 🔹 Validar tipo_orden, default a "service" si es inválido o vacío
    if (!tipo_orden || !["reparacion", "service"].includes(tipo_orden)) {
      tipo_orden = "service";
    }

    const year = new Date().getFullYear();

    // 🔹 Función helper para convertir a número o null
    const toNumberOrNull = (v) =>
      v === "" || v === undefined || v === null ? null : Number(v);

    costo = toNumberOrNull(costo);
    repuesto = toNumberOrNull(repuesto);
    manoobra = toNumberOrNull(manoobra);
    total = toNumberOrNull(total);

    // 🔹 Regla de negocio: garantía
    if (presu === "Sí") {
      costo = 0;
      repuesto = 0;
      manoobra = 0;
      total = 0;
      iva = "No";
    }

    // 🔹 Buscar último número de orden del año
    const resultLast = await pool.query(
      `SELECT numorden 
       FROM ingreso 
       WHERE numorden LIKE $1 
       ORDER BY numorden DESC 
       LIMIT 1`,
      [`ORD-${year}-%`]
    );

    let nextNumber = 1;
    if (resultLast.rows.length > 0) {
      const lastNumOrden = resultLast.rows[0].numorden;
      const lastSequence = parseInt(lastNumOrden.split("-")[2], 10);
      nextNumber = lastSequence + 1;
    }

    const newNumOrden = `ORD-${year}-${String(nextNumber).padStart(4, "0")}`;

    // 🔹 Ajustes específicos si es service
    if (tipo_orden === "service") {
      falla = null;
      repuesto = 0;
    }

    // 🔹 Insertar en DB
    const result = await pool.query(
      `INSERT INTO ingreso (
        client_id, numorden, tipo_orden, equipo, falla, observa, fecha, nserie,
        costo, imagenurl, repuesto, manoobra, total, iva, presu, salida, user_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      )
      RETURNING *`,
      [
        client_id,
        newNumOrden,
        tipo_orden,
        equipo,
        falla,
        observa,
        fecha || null,
        nserie,
        costo,
        imagenurl || null,
        repuesto,
        manoobra,
        total,
        iva || null,
        presu || null,
        salida || null,
        userId
      ]
    );

    const ingreso = result.rows[0];

    // 🔹 Para mostrar en frontend con formato visual
    ingreso.numorden_visual = getNumeroVisual(ingreso.numorden, ingreso.tipo_orden);

    res.status(201).json(ingreso);
  } catch (error) {
    next(error);
  }
};

/////         Eliminar ingreso              //////

 const deleteIngreso = async (req, res, next) => {
  const { id } = req.params;

  try {
    // 1. Buscar imagen asociada
    const resultSelect = await pool.query(
      "SELECT imagenurl FROM ingreso WHERE iid = $1",
      [id]
    );

    if (resultSelect.rows.length === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const imagenPath = resultSelect.rows[0].imagenurl;

    // 2. Borrar la orden en la BD
    const resultDelete = await pool.query(
      "DELETE FROM ingreso WHERE iid = $1",
      [id]
    );

    if (resultDelete.rowCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // 3. Si hay imagen asociada, eliminarla de Supabase
    if (imagenPath) {
      const { error } = await supabase.storage
        .from("ingresos") // 👈 nombre del bucket
        .remove([imagenPath]);

      if (error) {
        console.error("Error eliminando imagen en Supabase:", error.message);
      }
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
   
   ///////       Actualizar ingreso  ///////

 const updateIngreso = async (req, res, next) => {
  try {
    // Confirmar base conectada
    const jwt_db = await pool.query("SELECT current_database()");
    console.log("Base de datos conectada:", jwt_db.rows[0].current_database);

    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Limpieza: "" → null
    for (let key in req.body) {
      if (req.body[key] === "") {
        req.body[key] = null;
      }
    }

    let {
      equipo,
      falla,
      observa,
      fecha,
      nserie,
      costo,
      imagenurl,
      repuesto,
      manoobra,
      total,
      iva,
      presu,
      salida,
      client_id,
    } = req.body;

    //  Helper: número o null
    const toNumberOrNull = (v) =>
      v === null || v === undefined ? null : Number(v);

    costo = toNumberOrNull(costo);
    repuesto = toNumberOrNull(repuesto);
    manoobra = toNumberOrNull(manoobra);
    total = toNumberOrNull(total);

    //  Regla de negocio: GARANTÍA
    if (presu === "Sí") {
      costo = 0;
      repuesto = 0;
      manoobra = 0;
      total = 0;
      iva = "No";
    }

    //  Normalizar salida
    const salidaValida =
      salida && salida.trim() !== ""
        ? new Date(salida).toISOString().split("T")[0]
        : null;

    console.log("Datos procesados en update:", {
      costo,
      repuesto,
      manoobra,
      total,
      iva,
      presu,
    });

    const ingresoActual = await pool.query(
      "SELECT tipo_orden FROM ingreso WHERE iid = $1",
      [id]
    );

    if (ingresoActual.rowCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    const { tipo_orden, numorden } = ingresoActual.rows[0];

    //  Regla de negocio: Si es "service", ajustar campos   
    if (tipo_orden === "service") {
      falla = null;
      repuesto = 0;
    }

    const estadoIngreso = await pool.query(
      "SELECT * FROM ingreso WHERE iid = $1",
      [id]
    );
    if (estadoIngreso.rowCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    if (estadoIngreso.rows[0].salida) {
      return res
        .status(400)
        .json({ message: "No se puede editar una orden cerrada." });
    } 
    //  UPDATE
    const result = await pool.query(
      `UPDATE ingreso SET
        equipo = $1,
        falla = $2,
        observa = $3,
        fecha = $4,
        nserie = $5,
        costo = $6,
        imagenurl = $7,
        repuesto = $8,
        manoobra = $9,
        total = $10,
        iva = $11,
        presu = $12,
        salida = $13,
        client_id = $14
       WHERE iid = $15
       RETURNING *`,
      [
        equipo,
        falla,
        observa,
        fecha || null,
        nserie,
        costo,
        imagenurl || null,
        repuesto,
        manoobra,
        total,
        iva || null,
        presu || null,
        salidaValida,
        client_id,
        id,
      ]
    );

    const ingreso = result.rows[0];

    ingresoActualizado.numorden_visual = getNumeroVisual(
      numorden,
      tipo_orden
    );

    return res.jeson(ingresoActualizado);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en UPDATE:", error);
    next(error);
  }
};
/////   todas las ordenes   ///


const getAllOrden = async (req, res, next) => {    

    try
    {
     const allorden = await pool.query('SELECT * FROM orden');  
     res.json(allorden.rows)
    } catch (error){
       next(error)
    }
    };

    /// una orden 

    const getOrden = async (req, res, next) => {
        try {
         
         const {id} = req.params
     
         const result = await pool.query('SELECT * FROM orden WHERE roid = $1', [id])
      
         if (result.rows.length === 0)
           return res.status(404).json({
             message: 'Task not found',
             
         });
      
           res.json(result.rows[0]);
     
        } catch (error) {
     
         next(error)
         
        }
        
     };

      //// crear orden   ///


     const createOrden = async (req, res, next) => {
        const {numorden, equipo, nserie, fecha, falla, observa, costo} = req.body
    
       try {
    
        const result = await pool.query(
            "INSERT INTO orden (numorden, equipo, , nserie, fecha, falla, observa, costo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ) RETURNING *",
             [ numorden, equipo, falla, nserie, fecha, falla, observa, costo]
            );
        
            res.json(result.rows[0])
        
       } catch (error) {
        next(error)
       }
    };

/////       eliminar orden   ////


const deleteOrden = async (req, res, next) => {

    const { id } = req.params
    
    try {
       const result = await pool.query('DELETE FROM orden WHERE roid = $1', [id]);
       
       if (result.rowCount === 0) 
           return res.status(404).json({
           message: "Task not found",
           });
   
       return res.sendStatus(204);
   } catch(error){
       next(error);
   }
   };

///// actualizar orden   //// 


const updateOrden = async (req, res, next) => {
   
    try {
        const { id } = req.params;
    const { equipo, nserie, fecha, falla, observa, ingreso, costo } = req.body;

   const result = await pool.query('UPDATE orden SET equipo = $1, nserie = $2, fecha = $3, falla = $4, observa = $5, costo = $6, roid = $8 RETURNING *',
         [equipo, nserie, fecha, falla, observa, ingreso, costo, id]
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

 

///////////////////////
 
 
 
 module.exports = { 
    getAllClient,
    getClient,
    createClient,
    deleteTask,
    upDateTask,

   

    getAllRoles,
    getRol,
    createRol,
    deleteRol,
    updateRoles,

    getAllIngresosSinFiltro,
    getAllIngreso,
    getIngreso,
    createIngreso,
    deleteIngreso,
    updateIngreso,

    getAllIngresoByUser,

    getAllOrden,
    getOrden,
    createOrden,
    deleteOrden,
    updateOrden
};
