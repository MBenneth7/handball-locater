const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const Park = require('./models/park');


//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/handball');
  console.log('Connected to HandBall DB')
}

//USING 'ejs' TO SET UP TEMPLATES FOR WEBPAGES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/////////////////////**ROUTES**//////////////////////
app.get('/',(req,res)=>{
    res.render('home');
});

//INDEX OF PARKS
app.get('/parks',async(req,res)=>{
    const parks = await Park.find();  
    res.render('parks/index', {parks});
});

//
app.get('/parks/:id',async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    //console.log(park);
    res.render('parks/show', {park});
})
////////////////////////////////////////////////////

//LISTENER
app.listen(3000,()=>{
    console.log('Listening on Route 3000!!!');
});




