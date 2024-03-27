const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser=require('body-parser');
require('dotenv').config()

let id=0;
let users=[];

app.use(cors())
app.use(express.static('public'))
// Trying this out. Saw it in a rap video once
app.use(bodyParser({extended:false}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users',(req,res)=>{
  // Create new user
  let username=req.body.username;
  // Need to check to see if that username has already been created
  let user=users.filter(user=>user.username==username);
  if(!user[0]){
    id++;
    const newUser={username:username,_id:id.toString(),count:0,log:[]};
    users.push(newUser);
    user=newUser;
  }
  else{
    user=user[0];
  }
  res.json(user);
})

app.get('/api/users',(req,res)=>{
  res.send(users);
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  let date=req.body.date?new Date(req.body.date):new Date();
  // Find the given user
  let user=users.filter(user=>user._id==req.params._id.toString());
  if(!user[0]){
    res.json({error:"Not a valid user"});
  }else{
    user=user[0];
    let exercise={description:req.body.description,
    duration: Number(req.body.duration),
    date: date.toDateString()
    };
    user.log.push(exercise);
    user.count++;
    res.json({username:user.username,_id:user._id,...exercise});
  }
})

app.get('/api/users/:_id/logs',(req,res)=>{
  let user=users.filter(user=>user._id==req.params._id)[0];

  let exercises=user.log;
  
  if(req.query.from){
    console.log("From: "+req.query.from);
    exercises=exercises.filter(e=>{
      let dateString=new Date(e.date).toDateString().substring(0,10);
      return dateString>=req.query.from;
  })
  }
  if(req.query.to){
    console.log("To: "+req.query);
    exercises=exercises.filter(e=>{
      let dateString=new Date(e.date).toJSON().substring(0,10);
      return dateString<=req.query.to;
  })}
  if(req.query.limit){
    exercises=exercises.filter((e,index)=>index<req.query.limit);
  }
  user.log=exercises;
  
  res.json(user);
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
