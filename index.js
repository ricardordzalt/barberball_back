const { PORT, URL_DB } = require('./config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

app.use(cors());
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

mongoose.connect(URL_DB, {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}, (err, res) => {
    if(err) throw err;
    console.log('Database is online');
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});