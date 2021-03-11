const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Mise en place du Schema
const IdeaSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    }, 
    details:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
        
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('ideas', IdeaSchema);