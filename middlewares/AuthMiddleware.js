const jwt = require('jsonwebtoken');
const Config = require('../config');

const AuthMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No se ha encontrado el token de autenticación' });
  }

  try {
    const key = Config.AUTH.TOKEN_ALGORITHM === 'RS256' ? Config.AUTH.TOKEN_PUBLIC_KEY : Config.AUTH.TOKEN_PRIVATE_KEY;
    const decoded = jwt.verify(token.replace('Bearer ', ''), key, { algorithms: [Config.AUTH.TOKEN_ALGORITHM] });
    res.locals.employee = decoded;
    next();
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
};

module.exports = AuthMiddleware;