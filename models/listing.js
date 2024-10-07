const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.model.js")

mongoose.connect("mongodb://127.0.0.1:27017/listing");

const isvalidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};
const wondereSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1562182384-08115de5ee97?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        validate: {
            validator: isvalidUrl,
            message: "Invalid url format",
        },
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1562182384-08115de5ee97?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

wondereSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})


const wonder = mongoose.model("wonder", wondereSchema);

module.exports = wonder;
