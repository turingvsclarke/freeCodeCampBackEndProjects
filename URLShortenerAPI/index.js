require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser=require('body-parser');
const app = express();
const dns=require('dns');

var urls={};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/',bodyParser({extended:true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',function(req,res){
  let shorturl=Object.keys(urls).length+1;
  /*** 
  dns.lookup(req.body.url,(error,address,family)=>{
    console.log(error);
    if(error){
      res.json({ error: 'invalid url' });
    }else{
      
    }
  })
  ***/
  urls[shorturl]=req.body.url;
  res.json({original_url : req.body.url, short_url : shorturl});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.get('/api/shorturl/:url',function(req,res){
  console.log(urls);
  console.log(req.params);
  if(urls[req.params.url]){
    res.redirect(urls[req.params.url]);
  }else{
    res.json({"error":"No short URL found for the given input"});
  }
})
