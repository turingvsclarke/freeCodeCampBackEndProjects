// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Send the current date as unix and utc if there is no date parameter provided
app.get("/api",function(req,res){
  res.json({unix:Date.now(),utc: new Date()})
});

app.get("/api/:date?",function(req,res){
  // This obtains the date string that the user passed.
  // The req params object looks like  {date:__datestring__}
  const date=req.params.date;
  // Try to get a valid date in two ways. If it doesn't work, print the error
  var dateObject=new Date(date);
  if(dateObject=="Invalid Date"){
    dateObject=new Date(date*1);
    if(dateObject=="Invalid Date"){
      res.json({error: "Invalid Date"});
    }
  }
    res.json({unix:Number(dateObject.getTime()),utc: dateObject.toUTCString()})
})



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 5000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
