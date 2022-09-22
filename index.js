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

//message schema
const MsgSchema = new mongoose.Schema({
  object:{
      type: String,
      required: true
  },
  id: {
      type: String,
      required: true
  },
  messaging_product: {
      type: String,
      required: true
  },
  display_phone_number: {
      type: String,
      required: true
  },
  phone_number_id: {
      type: String,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  wa_id: {
      type: String,
      required: true
  },
  from: {
      type: String,
      required: true
  },
  timestamp: {
      type: String,
      required: true
  },
  body: {
      type: String,
      required: true
  },
  type: {
      type: String,
      required: true
  },
  field: {
      type: String,
      required: true
  }
});

const Messages= mongoose.model('messages', MsgSchema);

/*const sch={
    object:String,
    id: String,
    messaging_product: String,
    display_phone_number: String,
    phone_number_id: String,
    name: String,
    wa_id: String,
    from: String,
    timestamp: String,
    body: String,
    type: String,
    field: String
}
const msg=mongoose.model("messages",sch);*/

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
  if(req.body.entry){
    //store message into the database
    const data=new Messages({

    object : req.body.object,
    id : req.body.entry[0].id,
    messaging_product : req.body.entry[0].changes[0].value.messaging_product,
    display_phone_number : req.body.entry[0].changes[0].value.metadata.display_phone_number,
    phone_number_id : req.body.entry[0].changes[0].value.metadata.phone_number_id,
    name : req.body.entry[0].changes[0].value.contacts[0].profile.name,
    wa_id : req.body.entry[0].changes[0].value.contacts[0].wa_id,
    from : req.body.entry[0].changes[0].value.messages[0].from,
    //id : req.body.entry[0].changes[0].value.messages[0].id,
    timestamp : req.body.entry[0].changes[0].value.messages[0].timestamp,
    body : req.body.entry[0].changes[0].value.messages[0].text.body,
    type : req.body.entry[0].changes[0].value.messages[0].type,
    field : req.body.entry[0].changes[0].field

    })
    await data.save();
  }
  else{
    console.log("This webhook has subscribed to only messages")
  }

  // Process the webhook updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);

});

app.listen();