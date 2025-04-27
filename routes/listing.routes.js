const { addListings, getAllListings, getListingCategories } = require('../controllers/listing.controller');
const { isUserLoggedIn, isAdminUser } = require('../middleware/middlewares');
const upload = require('../middleware/upload');

const router = require('express').Router();


router.post('/add-listing', isUserLoggedIn, isAdminUser,upload.array('images', 10),addListings);

router.get('/get-all-listings', isUserLoggedIn,getAllListings);

router.get('/get-listing-categorie/:cat', isUserLoggedIn,getListingCategories);

module.exports = router;