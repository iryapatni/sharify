const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["available","unavailable","reserved"],
        default: "available"
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Tools",
            "Electronics",
            "Books",
            "Sports",
            "Furniture",
            "Vehicles",
            "Appliances",
            "Camera & Gear",
            "Fashion",
            "Gaming",
            "Instruments",
            "Home Essentials",
            "Others"
        ]
    },

    image: {
        type: String,
        default: "/uploads/default-product.png"
    },
    pricePerDay: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

module.exports=mongoose.model("Product", productSchema);