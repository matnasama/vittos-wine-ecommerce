const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

// En verifyToken.js
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ message: 'Usuario no autenticado' });
  }
  
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso denegado: se requieren privilegios de administrador' 
    });
  }
  
  next();
}

module.exports = { verifyToken, verifyAdmin };
