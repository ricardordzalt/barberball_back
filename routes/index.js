const express = require('express');
const app = express();
const userRoutes = require('./user');
const loginRoutes = require('./login');

app.use('/user', userRoutes);
app.use('/login', loginRoutes);

module.exports = app;