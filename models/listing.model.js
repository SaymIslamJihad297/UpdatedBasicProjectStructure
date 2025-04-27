const mongoose = require('mongoose');
const {Schema} = mongoose;


const listingSchema = new Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      location: { type: String, required: true },
      url: { type: String, required: true },
      categorie: {
        type: String,
        required: true,
        enum: ['tour', 'lodging', 'cars', 'fun facts'],
      },
      images: [],
    },
    { timestamps: true }
);



listingSchema.index({ categorie: 1 });

  
module.exports = mongoose.model('Listing', listingSchema);