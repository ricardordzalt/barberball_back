const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['admin', 'normal'],
    mesasge: '{VALUE} no es un rol válido'
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    fatherSurname: {
        type: String,
        default: ''
    },
    motherSurname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        default: 'normal',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('User', userSchema);