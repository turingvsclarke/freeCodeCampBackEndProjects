require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser=require('body-parser');
const app = express();
const dns=require('dns');

const dnsLookup=addr=>dns.lookup(addr,(err,addr)=>{
  return err?false:true;
});

// Basic Configuration
const port = process.env.PORT || 3000;

// Store the urls in an array
let urls={};

app.use(cors());

app.use(bodyParser({extended:false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',function(req,res){
  let url=req.body.url;
  
  let urlTest=/^https:\/\//;
  
  validURL=dnsLookup(url);

  if(!validURL || !urlTest.test(url)){
    res.json({error:'invalid url'});
  }
  else{
    if(!Object.values(urls).includes(url)){
      urls[Object.keys(urls).length+1]=req.body.url;
    }
    res.json({original_url:req.body.url,short_url:Object.keys(urls).length})
  }
});

app.get('/api/shorturl/:shorturl',function(req,res){
  let shorturl=req.params.shorturl;
  if(urls[shorturl]){
    res.redirect(urls[shorturl]);
  }else{
    res.json({"error":"No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
