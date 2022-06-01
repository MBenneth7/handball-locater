const mongoose = require('mongoose');
const Park = require('../models/park');
//SMALLER DATAS SET
const smallerParks = require ('../seeds/smallerParks');
//LARGER DATASET
//const parks = require('../seeds/parks');

//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/handball');
  console.log('Connected to HandBall DB')
}

const seedDB = async()=>{
    //DELETING OUR DB EVERYTIME WE RE-SEED OUR DATABASE
    await Park.deleteMany({});

    for(let i = 0; i < smallerParks.length; i++){
        const park = new Park({
            name: `${smallerParks[i].Name}`,
            location: `${smallerParks[i].Location}`,
            courts: smallerParks[i].Num_of_Courts,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita quo saepe vitae nemo neque? Eius in natus incidunt adipisci corporis, atque odio culpa dicta earum iusto exercitationem sunt quia possimus? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni nesciunt repellendus deleniti, molestias error beatae doloremque id. Eum recusandae, in quasi ab laudantium amet. Tenetur maxime non provident ab blanditiis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt deleniti ratione nobis. Ipsum assumenda suscipit neque ullam facilis dignissimos est perspiciatis velit voluptate quam possimus, similique deleniti odio fugit alias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ratione necessitatibus, rerum nostrum sint asperiores ullam dolorem velit cum doloribus dolorum! Ut, tenetur quisquam enim maiores quod ipsa magnam illo!'
        });
        await park.save();
    }
}

seedDB();