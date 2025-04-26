const mongoose = require('mongoose');
const {Schema} = mongoose;


const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
            index: true,
        },
        images: []
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Listing', listingSchema);