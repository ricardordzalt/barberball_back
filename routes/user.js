const express = require('express');
const app = express();
const userController = require('../controllers/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

app.get('/', verifyToken, verifyAdminRole, userController.getUsers);
app.post('/', userController.addUser);
app.put('/:id', verifyToken, userController.updateUser);
app.delete('/:id', verifyToken, userController.deleteUser);

module.exports = app;