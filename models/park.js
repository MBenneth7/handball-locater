//DETERMINING WHAT WE WANT OUR PARK DATA TO CONTAIN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkSchema = new Schema({
    name: String,
    location: String,
    courts: Number,
    description: String,
    image: String,
    geometry:{
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        type: [Number],
        required: true
    },
    reviews: [
        {
            //LINKING OUR REVIEWS TO OUR PARKS
            type: Schema.Types.ObjectId,
            ref: 'Review'
         }
    ]
});

module.exports = mongoose.model('Park', ParkSchema);





 