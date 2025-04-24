const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];

  if (!header) return res.status(401).json({ message: 'No autorizado' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
}

module.exports = verifyToken;
