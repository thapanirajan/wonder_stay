const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const model = require("../models/listing.js");
const Review = require("../models/reviews.model.js")

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next()
    }
}

const handlePostReviews = async (req, res) => {
    const id = req.params.id
    let listing = await model.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Page not found")
    }
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New Review created")
    res.redirect(`/listing/${req.params.id}`)
}


const handleDeleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await model.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listing/${id}`);
}


module.exports = {
    handlePostReviews,
    validateReview,
    handleDeleteReview
};