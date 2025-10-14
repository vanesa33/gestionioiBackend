const jwt = require('jsonwebtoken');

const verifyTokenUser = (req, res, next) => {
  console.log('Entrando a verifyTokenUser');

  // Intentamos obtener el token desde la cookie primero
  let token = req.cookies?.token;

  // Si no está en cookie, intentamos obtenerlo desde el header Authorization
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Si aún no hay token, respondemos con error 401
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email;
    req.role_id = decoded.role_id;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role_id: decoded.role_id
    };

    // Todo bien, pasamos al siguiente middleware
    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {

if (req.role_id === 1) {
  return next()
}

return res.status(403).json({ error: "Unauthorized only admin user"})

};

const verifyFactura = (req, res, next) => {
  if(req.role_id === 2 || req.role_id === 1) {
    return next ()
  }
  return res.status(403).json({ error: "Unauthorized only Facturador user"})
};

const verifyTecnico = (req, res, next) => {
  if(req.role_id === 3 || req.role_id === 1){
    return next()
  }
  return res.status(403).json({ error: "Unauthorized only Tecnico user"})
  };

  module.exports = {
    verifyTokenUser,
      verifyAdmin,
      verifyFactura,
      verifyTecnico
  }

/*const  jwt  = require  ('jsonwebtoken');

const verifyToken =(req, res, next) =>{
  const {token} = req.cookies;
  try {    
  
 if (!token)
  return res.status(401).json({ message: "No token, authorization denied"}); 

     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) return res.status(403).json({message: "Invalis token"});

      req.user = user
      next();
})
  }
  catch (error) {
    
  }
};


module.exports = {
  verifyToken
};
*/