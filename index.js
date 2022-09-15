var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');
const mongoose=require('mongoose');
//var connectDB=require('./config/db');
//const message = require('./models/Message');

//connect database
//connectDB();

app.use(express.json());
mongoose.connect("mongodb+srv://Naik12345:Naik12345@wainbox.n9rrz2q.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser:true,
  useUnifiedTopology:true
},(err)=>{
  if(!err)
  {
    console.log("connected to db")
  }else{
    console.log("error")
  }
})

const sch={
  object:String
}

const msg=mongoose.model("messages",sch);


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function(req, res) {
  //console.log(req);
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get('/webhook', function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/webhook', async(req, res) => {
  console.log('webhook request body:', req.body);

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  const data=new msg({
    object:req.body.object
  })
  await data.save();

  // Process the webhook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);

});

app.listen();






/*
const bodyParser = require('body-parser');
const express=require('express');
const connectDB=require('./config/db');
const app = express();
var xhub = require('express-x-hub');
const message = require('./models/Message');

//connect database
connectDB();

//specifying port
const PORT =process.env.PORT || 5000;

//init middleware
app.use(express.json({extended:false}));
//app.set('port', (process.env.PORT || 5000));
//app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser());
//app.use(methodOverride());
//app.use(bodyParser.json());

const token = process.env.TOKEN || 'token';
const received_updates = [];

//app.get('/', function(req, res) {
  //console.log(req);
  //res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
//});
app.get('/', (req,res) => res.send('API Running'));

app.get('/webhook', async(req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/webhook', async(req, res) => {
  console.log('Webhook request body:', req.body);

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  
  //destructure request body
  const {object} = req.body;
  try {

    //Store to the database
    data=new Message({
      object
    })
    await data.save();

    //const val=await message.save();
    //res.json(val);
    // Process the Webhook updates here
    //received_updates.unshift(req.body);
    res.sendStatus(200);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(PORT,() => console.log(`Server starte at ${PORT}`));
//app.listen();
*/