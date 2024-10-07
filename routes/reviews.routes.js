const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware")

const wrapasync = require("../utils/asyncwrap");

const {
    handlePostReviews,
    handleDeleteReview
} = require("../controllers/review.controller");


// review route 
router.post("/", validateReview, wrapasync(handlePostReviews));

// delete review route
router.delete("/:reviewId", wrapasync(handleDeleteReview));

module.exports = router;