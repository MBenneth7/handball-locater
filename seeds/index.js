require('dotenv').config();

const mongoose = require('mongoose');
const Park = require('../models/park');
const Comment = require('../models/comment');
const Review = require('../models/review');
//SMALLER DATAS SET
//const parks = require ('../seeds/smallerParks');
//LARGER DATASET
const parks = require('../seeds/parks');

//DB URL, USE MONGO ATLAS KEY TO CONNECT TO ATLAS DB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/handball';


//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect(dbUrl);
  console.log('Connected to HandBall DB')
}

//FUNCTION TO REMOVE ANY EXTRA CHARACTERS AND UNECESSARY WORDS AND PROPERLY CASE THEM
function caseString(str){
    //ARRAY TO CONTAIN STRINGS THAT WE DON'T WANT IN NAME
    let invalidStr = ['P/G','('];
    //DEFAULT SETTING FOR 'end' VARIABLE
    let end = str.length;
    //SETTING OUR 'newStr' TO A STRING W/O UNECCESARY SPACES (GLOBAL REGEX)
    let newStr = str.replace(/\s+/g, '');


    //LOOP TO FIND IF UNWANTED STRINGS ARE PRESENT IN THE CURRENT STRING
    for(let i = 0; i <invalidStr.length; i++){
        if(str.indexOf(invalidStr[i]) !== -1){
            //IF FOUND, SET THE LENGTH OF THE STRING TO END BEFORE THE UNCESSARY STRING
            end = str.indexOf(invalidStr[i]);
            break;
        }
    }

    //'newStr' WILL NOW BE THE STRING W/O THE UNWANTED STRING IN ITS NAME
    newStr = str.slice(0,end);

    //SPLITTING THE STRINGS TO UPPERCASE FIRST CH AND LOWERCASE NEXT SET OF CH
    newStr = newStr.toLowerCase().split(' ');
    for (let i = 0; i < newStr.length; i++) {
      newStr[i] = newStr[i].charAt(0).toUpperCase() + newStr[i].slice(1); 
    }

    //IF WE DIDN'T FIND ANY UNWANTED STRING AND THE STRING 'PARK' IS PRESENT AND THE STRING 'PLAYGROUND' IS PRESENT
    //JOIN THE CH'S TOGETHER W/ 'Park'
    //ELSE JUST RETURN THE MUTATED STRING W/FIRST CH CAPITALIZED
    if(end!==str.length && newStr.indexOf('Park') === -1 && newStr.indexOf('Playground') === -1)
        return newStr.join(' ') + 'Park';
    else
        return newStr.join(' ');
}

const seedDB = async()=>{
    //DELETING OUR DB EVERYTIME WE RE-SEED OUR DATABASE
    await Park.deleteMany({});
    await Comment.deleteMany({});
    await Review.deleteMany({});


    for(let i = 0; i < parks.length; i++){
        const park = new Park({
            name: `${caseString(parks[i].Name)}`,
            location: `${parks[i].Location}`,
            geometry: {
                type: "Point",
                coordinates: [
                  Number(parks[i].lon),
                  Number(parks[i].lat)
                ]
            },
            courts: parks[i].Num_of_Courts,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita quo saepe vitae nemo neque? Eius in natus incidunt adipisci corporis, atque odio culpa dicta earum iusto exercitationem sunt quia possimus? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni nesciunt repellendus deleniti, molestias error beatae doloremque id. Eum recusandae, in quasi ab laudantium amet. Tenetur maxime non provident ab blanditiis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt deleniti ratione nobis. Ipsum assumenda suscipit neque ullam facilis dignissimos est perspiciatis velit voluptate quam possimus, similique deleniti odio fugit alias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ratione necessitatibus, rerum nostrum sint asperiores ullam dolorem velit cum doloribus dolorum! Ut, tenetur quisquam enim maiores quod ipsa magnam illo!',
            images:[
                {
                    url: 'https://res.cloudinary.com/dyyp1kotd/image/upload/v1655840363/Handball-Locator/handball_bifvsq.jpg',
                    filename: 'Handball-Locator/handball_bifvsq'
                }
            ]
        });
        await park.save();
    }
}

seedDB();