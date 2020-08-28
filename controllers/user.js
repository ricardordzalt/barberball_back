const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const getUsers = (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 0;
    const activeUsers = { status: true };
    User.find(activeUsers, 'name email role status')
        .skip(from).limit(limit).exec((err, users) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            User.countDocuments(activeUsers, (err, count) => {
                if(err) {
                    return res.status(400).send({ ok: false, err });
                };

                res.send({ ok: true, users, count });
            });
        });
};

const addUser = (req, res) => {
    let { name, email, password, role } = req.body;
    password = bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if(hashErr) {
            return res.status(400).send({ ok: false, err: hashErr });
        };
        let user = new User({
            name, email, password: hashedPassword, role
        });
        user.save((err, userDB) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            res.send({ ok: true, user: userDB });
        });
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['name', 'email', 'role', 'status']);
    const options = { new: true, runValidators: true };
    User.findByIdAndUpdate(id, body, options, (err, userDB) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        res.send({ ok: true, user: userDB });
    });
};

const deleteUser = (req, res) => {
    const { id }  = req.params;
    const newStatus = { status: false };
    User.findByIdAndUpdate(id, newStatus, (err, deletedUser) => {
        if(err){
            return res.status(400).send({ ok: false, err });
        };
        if(!deletedUser) {
            return res.status(400).send({ ok: false, err: { message: 'Usuario no encontrao' } });
        };
        res.send({ ok: true, user: deletedUser });
    });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };