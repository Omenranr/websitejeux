const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Mise en place du Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: 'normal',
    }
});

mongoose.model('users', UserSchema);