const Park = require('../models/park');

//CLOUDINARY FOR IMAGES
const {cloudinary} = require('../cloudinary');


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

module.exports.addImagesForm = async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    res.render('parks/addImages', {park});
}

module.exports.addImages = async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findByIdAndUpdate(id, {...req.body.park});
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
    park.images.push(...imgs);

    await park.save();

    //DELETING IMAGES

    if(req.body.deleteImages){
        //DELETING IMAGES ON CLOUDINARY SIDE
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({ $pull: {images:{ filename: { $in: req.body.deleteImages } } } });
        //console.log(park);
    }

    //console.log(req.body);


    req.flash('success', 'Succesfully edited images!!!');
    res.redirect(`/parks/${park._id}`);
}

module.exports.search = async(req,res)=>{
    const parks = await Park.find();  
    res.render('parks/index', {parks});
}