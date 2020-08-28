const { JWT_SEED, TOKEN_EXPIRATION, GOOGLE_CLIENT_ID } = require('../config');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, userDB) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        if(!userDB) {
            return res.status(401).send({ ok: false, err: { message: 'Usuario o contraseña incorrectos'} });
        };

        bcrypt.compare(password, userDB.password, (hashErr, didMatch) => {
            if(hashErr) {
                return res.status(400).send({ ok: false, err: hashErr });
            };
            if(didMatch) {
                const token = jwt.sign({ user: userDB }, JWT_SEED, { expiresIn: TOKEN_EXPIRATION });
                res.send({ ok: true, user: userDB, token });
            }else {
                return res.status(401).send({ ok: false, err: { message: 'Usuario o contraseña incorrectos'} });
            };
        });
    });
};

const verify = async token => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log('payload', payload);
    const { name, email } = payload;
    return { name, email, google: true };
};

const loginGoogle = async (req, res) => {
    const { idToken } = req.body;
    try{ 
        const googleUser = await verify(idToken);
        const userDB = await User.findOne({ email: googleUser.email });
        if(userDB){
            if(!userDB.google){
                console.log('err');
                return res.status(400).send({ 
                    ok: false, 
                    err: { 
                        message: 'Tu usuario ya ha sido registrado, debes usar autenticación normal'
                    } 
                });
            }else{
                const token = jwt.sign({ user: userDB }, JWT_SEED, { expiresIn: TOKEN_EXPIRATION });
                res.send({ ok: true, user: userDB, token });
            };
        }else {
            const { email, name, google } = googleUser;
            const data = { email, name, google, password: ':)' };
            let newUser = new User(data);
            await newUser.save();
            console.log('newUser', newUser);
            const token = jwt.sign({ user: newUser }, JWT_SEED, { expiresIn: TOKEN_EXPIRATION });
            res.send({ ok: true, user: newUser, token });
        };
    }catch(err) {
        return res.status(400).send({ ok: false, err });
    };
};

module.exports = { loginUser, loginGoogle };