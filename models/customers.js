const mongoose= require('mongoose');
const Schema=mongoose.Schema;// Just for calling mongoose.Schema easily

const CustomerSchema= new Schema({
    name: String,
    email: String,
    balance: Number,
    acc_no : Number
});

module.exports= mongoose.model('Customer', CustomerSchema);