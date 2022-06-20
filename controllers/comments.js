const Park = require('../models/park');
const Comment = require('../models/comment');

module.exports.postComment = async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    const comment = new Comment(req.body.comment);

    //ADDING THE 'req.user_id' TO THE AUTHOR FIELD OF OUR COMMENT DATA, ADDING A AUTHOR TO A COMMENT
    comment.author = req.user._id;

    
    //ADDING A 'comment'  TO A SPECEFIC PARK
    park.comments.push(comment);

    await comment.save();
    await park.save();

    req.flash('success', 'Comment successfully made!!!');
    res.redirect(`/parks/${park._id}`);
}

module.exports.deleteComment = async(req,res)=>{
    const {id, commentId} = req.params;

    await Park.findByIdAndUpdate( id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    req.flash('success', 'Deleted Comment!!!');
    res.redirect(`/parks/${id}`);
}