const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/handball');
  console.log('Connected to HandBall DB')
}

//USING 'ejs' TO SET UP TEMPLATES FOR WEBPAGES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//ROUTES
app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/parks',(req,res)=>{
    res.render('parks/index');
});

//LISTENER
app.listen(3000,()=>{
    console.log('Listening on Route 3000!!!');
})




