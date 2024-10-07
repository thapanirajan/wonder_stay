const ExpressError = require("../utils/expressError.js");
const { wonderSchema } = require("../schema.js");
const model = require("../models/listing.js");

const handleGetAllListings = async (req, res) => {
    const listings = await model.find({});
    res.render("templates/listings/index", { listings });
};

const handleCreateListing = async (req, res) => {
    const newListing = new model(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created")
    res.redirect("/listing");
};

const handleCreateListingForm = (req, res) => {
    res.render("templates/listings/create");
};

const handleListingDetailByid = async (req, res) => {
    const { id } = req.params;
    let detail = await model.findById(id).populate("reviews").populate({
        path: "owner",
        select: "name email"
    });
    if (!detail) {
        req.flash("error", "Requested Listing doesnot exists")
        res.redirect("/listing")
    }
    let averageRating = 0;
    let totalrating = 0;
    if (detail.reviews.length > 0) {
        reviewNumber = detail.reviews.length;
        detail.reviews.forEach((review) => {
            totalrating = totalrating + Number(review.rating);
        })
        averageRating = (totalrating / reviewNumber).toFixed(1);
    }
    res.render("templates/listings/detail", { detail, averageRating });
};

const handleEditListingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await model.findById(id);
    res.render("templates/listings/edit", { listing });
};

const handleUpdateListingDetails = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, country } = req.body;
    await model.findByIdAndUpdate(id, {
        title,
        description,
        image,
        price,
        country,
    });
    req.flash("success", "Listing updated!!");
    res.redirect(`/listing/${id}`);
};

const handleDeleteListing = async (req, res) => {
    const { id } = req.params;
    await model.findByIdAndDelete(id);
    req.flash("success", "Listing deleted")
    res.redirect("/listing");
};

const validateListing = (req, res, next) => {
    let { error } = wonderSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



module.exports = {
    handleGetAllListings,
    handleCreateListing,
    handleCreateListingForm,
    handleListingDetailByid,
    handleEditListingForm,
    handleUpdateListingDetails,
    handleDeleteListing,
    validateListing,
};
