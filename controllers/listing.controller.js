const fs = require('node:fs');
const cloudinary = require('../middleware/cloudinary.config');
const path = require('path');
const listingModel = require('../models/listing.model');
const ExpressError = require('../utils/ExpressError');
const { addListingSchemaValidator } = require('../validations/schemaValidations');

module.exports.addListings = async(req, res)=>{

    const {error, value} = addListingSchemaValidator.validate(req.body);

    if(error) return res.status(400).json({ error: error.details[0].message });

    const {title, description, location, url, categorie} = value;

    const folderName = 'allDocuments';

    const uploadResults = await Promise.all(
        req.files.map(async (file)=>{
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                public_id: `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                folder: `user_files/${folderName}`,
                type: 'authenticated',
            })

            fs.unlinkSync(file.path); 

            return {
                originalName: file.originalname,
                url: result.secure_url,
                public_id: result.public_id,
              };
        })
    )
    

    const data = await listingModel.create({
        title,
        description,
        location,
        url,
        description,
        categorie,
        images: uploadResults,
    })

    res.json({
        message: "Listing Posted successfully",
        data,
    })
}



module.exports.getAllListings = async (req, res) => {
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10;
  
      const data = await listingModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const total = await listingModel.countDocuments();
  
      res.status(200).json({
        data,
        hasMore: skip + limit < total
      });
  };


module.exports.getListingCategories = async(req, res)=>{
    const categorie = req.params.cat;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const data = await listingModel.find({categorie}).sort({createdAt: -1}).skip(skip).limit(limit);

    res.send(data);
}