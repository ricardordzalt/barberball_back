const { JWT_SEED } = require('../config');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SEED, (err, decoded) => {
            if(err) {
                return res.status(401).send({ ok: false, err: { message: 'Token inválido, no cuentas con los permisos necesarios'} });
            };
            req.user = decoded.user;
            next();
        });
    }else {
        return res.status(401).send({ ok: false, err: { message: 'No cuentas con los permisos necesarios' } });
    };
};

const verifyAdminRole = (req, res, next) => {
    if(req.user.role === 'admin') {
        next();
    }else {
        return res.send({ ok: false, err: { message: 'Información restringida al administrador' } });
    };
};

module.exports = { verifyToken, verifyAdminRole };