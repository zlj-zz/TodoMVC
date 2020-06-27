const mongoose = require('mongoose');
//const dbUrl = "mongodb://127.0.0.1:27017/todo"

mongoose.connect(dbUrl, {useNewUrlParser: true})

mongoose.connection.on("connected", (error) => {
    console.log("mongodb connect successful!")
})

const Schema = mongoose.Schema;

// Todo
const todoModel = new Schema({
    data: {
        type: String,
    },
    userId: {
        type: String,
    }
});

//用户
const userModel = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String
    },
    userName: {
        type: String,
        required: true
    }
});

const Models = {
    User: mongoose.model('User', userModel),
    Todo: mongoose.model('Todo', todoModel)
};

module.exports = Models;
