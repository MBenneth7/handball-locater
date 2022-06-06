//DETERMINING WHAT WE WANT OUR PARK DATA TO CONTAIN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkSchema = new Schema({
    name: String,
    location: String,
    courts: Number,
    description: String,
    image: String,
    reviews: [
        {
            //LINKING OUR REVIEWS TO OUR PARKS
            type: Schema.Types.ObjectId,
            ref: 'Review'
         }
    ]
});

module.exports = mongoose.model('Park', ParkSchema);





 