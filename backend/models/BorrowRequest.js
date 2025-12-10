const mongoose=require("mongoose");

const borrowRequestSchema=new mongoose.Schema({
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending","approved", "rejected", "returned"],
            default: "pending"
        },
        startDate: {
            type: Date,
            required: true
        },
       endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                return value > this.startDate;
                },
                message: "End date must be after start date"
            }
        },
        totalDays: {
            type: Number,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        }

},
{
  timestamps: true  
}
);


module.exports=mongoose.model("BorrowRequest", borrowRequestSchema);