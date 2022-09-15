const bodyParser = require('body-parser');
const express=require('express');
const connectDB=require('./config/db');
const app = express();
const xhub = require('express-x-hub');
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
app.use(bodyParser.json());

const token = process.env.TOKEN || 'token';
const received_updates = [];

//app.get('/', function(req, res) {
  //console.log(req);
  //res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
//});
app.get('/', (req,res) => res.send('API Running'));

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