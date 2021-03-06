//DETERMINING WHAT WE WANT OUR PARK DATA TO CONTAIN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//FOR VIRTUALS TO BE ADDED TO DATA
const opts = {toJSON:{virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//FOR THUMBNAIL VIEW ON EDIT IMAGES FORM

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const ParkSchema = new Schema({
    name: String,
    location: String,
    courts: Number,
    description: String,
    images: [ImageSchema],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            //LINKING OUR REVIEWS TO OUR PARKS
            type: Schema.Types.ObjectId,
            ref: 'Review'
         }
    ],
    comments: [
        {
            //LINKING OUR COMMENTS TO OUR PARKS
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, opts);

//VIRTUAL PROPERTY TO ADJUST TO MAPBOX FORMAT FOR USING A 'properties' OBJECT FOR DISPLAYING DATA ON MAP
//WE ARE ADDING 'properties' TO OUR DATASET BUT NOT SAVING IT INTO THE DB, JUST TO FORMAT
//USED IN showClusterMap.js

ParkSchema.virtual('properties.popUpMarkup').get(function(){
    return `<h6>
                <a href = "/parks/${this._id}">${this.name}</a>
            </h6>
            <p>Number of Courts: <b>${this.courts}</b></p>
            `;
});

module.exports = mongoose.model('Park', ParkSchema);





 