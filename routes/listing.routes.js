const express = require("express");
const router = express.Router();
const {
    handleGetAllListings,
    handleCreateListing,
    handleCreateListingForm,
    handleListingDetailByid,
    handleEditListingForm,
    handleUpdateListingDetails,
    handleDeleteListing,
} = require("../controllers/listing.controller.js");

const wrapasync = require("../utils/asyncwrap");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


// Route to get all listings
router.get("/", wrapasync(handleGetAllListings));

// Create route
router.post("/", validateListing, wrapasync(handleCreateListing));

// Render the create listing form
router.get("/create", isLoggedIn, wrapasync(handleCreateListingForm)); // ggg

// Route to get a specific listing by ID
router.get("/:id", wrapasync(handleListingDetailByid));

// Render the edit listing form
router.get("/edit/:id", isLoggedIn, isOwner, wrapasync(handleEditListingForm)); //gg

// Update a listing by ID
router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapasync(handleUpdateListingDetails));

// Delete a listing by ID
router.delete("/:id", isLoggedIn, isOwner, wrapasync(handleDeleteListing));

module.exports = router;
