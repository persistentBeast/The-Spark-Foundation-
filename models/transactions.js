const mongoose= require('mongoose');
const Schema=mongoose.Schema;// Just for calling mongoose.Schema easily

const TransactionSchema= new Schema({
    sender: Number,
    reciever: Number,
    amount: Number,
    status : String,
    date : { type: String, default: Date } 
});

module.exports= mongoose.model('Transaction', TransactionSchema);