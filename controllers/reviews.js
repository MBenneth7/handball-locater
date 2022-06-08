const Park = require('../models/park');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    const review = new Review(req.body.review);

    //ADDING THE 'req.user_id' TO THE AUTHOR FIELD OF OUR REVIEW DATA, ADDING A AUTHOR TO A REVIEW
    review.author = req.user._id;

    //ADDING A 'review'  TO A SPECEFIC PARK
    park.reviews.push(review);

    await review.save();
    await park.save();

    req.flash('success', 'Review successfully made!!!');
    res.redirect(`/parks/${park._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Park.findByIdAndUpdate( id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Deleted Review!!!');
    res.redirect(`/parks/${id}`);
}