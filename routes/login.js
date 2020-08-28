const express = require('express');
const app = express();
const loginController = require('../controllers/login');

app.post('/', loginController.loginUser);
app.post('/google', loginController.loginGoogle);

module.exports = app;