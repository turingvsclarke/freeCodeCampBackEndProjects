const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser=require('body-parser');
require('dotenv').config()

let id=1;
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
  let newUser={username:req.body.username,_id:id++}
  // Need to check to see if that username has already been created
  let user=users.filter(user=>user.username==newUser.username);
  if(user.length==0){
    users.push(newUser);
  }
  res.json(newUser);
})

app.get('/api/users',(req,res)=>{
  res.send(users);
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
