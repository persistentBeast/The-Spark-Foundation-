const express=require("express");
const app=express();
const path= require('path');
const mongoose= require('mongoose');
const Customer=require('./models/customers');
const Transaction=require('./models/transactions');
const methodOverride=require('method-override');
const appError=require('./utilities/ErrorHandling')
const dotenv = require('dotenv');
dotenv.config();
const dbUrl=process.env.db_url;
// 'mongodb://localhost:27017/Spark-Bank'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db=mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static('static'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.get("/", (req, res)=>{
    res.render('home');
})
app.get("/customers", async (req, res)=>{

    try{
        const customers= await Customer.find({});
        res.render('customers/index', {customers});
    }catch(e){
        next(e);
    }

});


app.get("/customers/customerdetails/:id", async (req,res,next)=>{
    try{
        const customer=await Customer.findById(req.params.id);
        res.render('customers/customerDetails', {customer});
    }catch(e){
        next(e);
    }
})

app.get("/transferfunds/:id", async (req,res,next)=>{
    try{
        const customer=await Customer.findById(req.params.id);
        res.render('Payments/index', {customer});
    }catch(e){
        next(e);
    }
})

app.get("/transactionHistory", async (req,res,next)=>{
    try{
        const transactions=await Transaction.find({}).sort({date : -1});    
        res.render("transactionHistory/index", {transactions});
    }catch(e){
        next(e);
    }
})

app.put("/transferfunds/:id", async (req, res,next)=>{
    
    try{
        const reciever_account=Number(req.body.reciever);
        const amount=Number(req.body.amount);
        const sender=await Customer.findById(req.params.id);
        const currentBalance=sender.balance;
        const reciever=await Customer.findOne({acc_no : reciever_account});

        if(!reciever || !sender){
            throw new Error;
        }else if(currentBalance<amount || amount<0){
            const transaction= new Transaction({ sender: sender.acc_no, reciever: reciever_account, amount: amount, status :"Failed"});
            await transaction.save();
        }else{
            const transaction= new Transaction({ sender: sender.acc_no, reciever: reciever_account, amount: amount, status :"Success"});
            await Customer.findByIdAndUpdate({_id : req.params.id}, {balance: currentBalance-amount});
            await Customer.findByIdAndUpdate({_id : reciever._id}, {balance: reciever.balance+amount});
            await transaction.save();

        }
        res.redirect("/transactionHistory");
    }catch(e){
        next(e);
    }
     
});

app.all('*', (req, res)=>{
    res.send("<h1> &#9888; PAGE NOT FOUND !!!</h1>");
})

app.use((err, req, res, next)=>{
    res.send("<h1> &#9888; Something Went Wrong !!!</h1>");
})

const port= process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Its Live");
})
