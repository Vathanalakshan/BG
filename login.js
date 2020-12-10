const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const jwt =require('jsonwebtoken');
const { User } = require('./models/user.js');
const { Log } = require('./models/logs.js');
const token = require('./checkToken');
const cors= require('cors');
const MONGOURL = "mongodb+srv://dbuser:dbuser@boursogame-9eaqw.mongodb.net/User?retryWrites=true&w=majority";
const app = express();
mongoose.connect((MONGOURL), {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("DB connected"))
    .catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json());
app.use(cors());

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.post('/login', (req, res) => {
    User.findOne({'identifiant': req.body.identifiant}, (err, user) => {
        if (!user) return res.status(400).json({message: 'Login failed, user not found'});
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(err){
                console.log(err);
                return res.status(401).json({message:"Err login" + err})
            }
            if(!isMatch) return res.status(400).json({
                message:'Wrong Password'
            });
            jwt.sign({"id":user.identifiant},"dududunga",{expiresIn : "1h"},(err,token)=>{
                console.log(user.identifiant+" connected");
                return res.status(200).json({token:token});
            });
        });
    });
});

app.post('/register', (req, res) => {
    console.log(req.body);
    const user = new User({
        identifiant: req.body.identifiant,
        password: req.body.password
    }).save((err, response)=>{
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err register" + err})
        }
        else {
            console.log("success")
            return res.status(200).send("Enregistrement Reussi");
        }
    })
});

app.get('/test',token.checkToken,(req,res)=>{
    res.send(req.decoded.id);
});

app.get('/getuser',token.checkToken,(req,res)=>{
    User.findOne({"identifiant":req.decoded.id},{ _id: 0,password:0,__v:0 },function(err, result) {
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err getuser" + err})
        }
        console.log(result);
        return res.status(200).json(result);
    });
});

app.post('/updateuser',token.checkToken,(req,res)=>{
    User.findOneAndUpdate({"identifiant":req.decoded.id},{$set: req.body.update},{new: true},function(err, result) {
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err Update"})
        }
        console.log("succes");
        res.status(200).send("Successful");
    });
});

app.post('/savelogs',token.checkToken,(req,res)=>{
    const log = new Log({
        userid: req.decoded.id,
        action: req.body.action,
        item:req.body.item,
        amount:req.body.amount
    }).save((err, response)=>{
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err log save" + err})
        }
        else {
            console.log("success")
            return res.status(200).send("Log save Reussi");
        }
    })
});
app.get('/getlogs',token.checkToken,(req,res)=>{
    Log.find({"userid":req.decoded.id},{ _id: 0,password:0,__v:0 },function(err, result) {
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err getlogs" + err})
        }
        console.log(result);
        return res.status(200).json(result);
    });
});

app.get('/getUsers',(req,res)=>{
    User.find({},{ _id: 0,password:0,__v:0, },function(err, result) {
        if(err){
            console.log(err);
            return res.status(401).json({message:"Err getuser" + err})
        }
        console.log(result);
        return res.status(200).json(result);
    });
});

const port = 4000;
app.listen(port, () => {
    console.log('server runnin on ${port}');
});
