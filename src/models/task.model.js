const { pool } = require('../db.js');

const TaskModel = {
  // Crear una nueva tarea (ingreso)
  async createTask(data) {
    const {
      nombre,
      telefono,
      domicilio,
      localidad,
      provincia,
      equipo,
      falla,
      observa,
      fecha,
    } = data;

    try {
      const result = await pool.query(
        `INSERT INTO ingreso 
         (equipo, falla, observa, fecha) 
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [equipo, falla, observa, fecha]
      );

      const ingreso = result.rows[0];

      const clientResult = await pool.query(
        `INSERT INTO client 
         (nombre, telefono, domicilio, localidad, provincia)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [nombre, telefono, domicilio, localidad, provincia]
      );

      return {
        ingreso,
        cliente: clientResult.rows[0]
      };
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las tareas
  async getAllTasks() {
    try {
      const result = await pool.query('SELECT * FROM ingreso');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Otras funciones: getById, delete, update...
};

module.exports = { TaskModel };
