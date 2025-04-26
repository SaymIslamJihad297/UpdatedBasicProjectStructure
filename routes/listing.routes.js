const { addListings, getAllListings } = require('../controllers/listing.controller');
const upload = require('../middleware/upload');

const router = require('express').Router();


router.post('/add-listing', upload.array('images', 10),addListings);

router.get('/get-all-listings', getAllListings);

module.exports = router;