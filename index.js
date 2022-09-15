var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');
const mongoose=require('mongoose');

//app.use(express.json());
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