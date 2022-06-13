const Park = require('../models/park');

//MAPBOX FOR GEOCODING
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
mbxGeocoding({accessToken: mapBoxToken});


module.exports.index = async(req,res)=>{
    const parks = await Park.find();  
    res.render('parks/allParks', {parks});
};

module.exports.showPark = async(req,res)=>{
    const {id} = req.params;

    //'populate' USED TO SHOW 'reviews' ASSOCIATED W/ PARK
    const park = await Park.findById(id).populate({
        path:'reviews comments',
        populate: {
            path: 'author'
        },
    });

    //REDIRECT IF PARK NOT FOUND
    if(!park){
        req.flash('error', 'Park not found!!!');
        return res.redirect('/parks');
    }

    console.log(park);
    res.render('parks/show', {park});
};

module.exports.search = async(req,res)=>{
    const parks = await Park.find();  
    res.render('parks/index', {parks});
}