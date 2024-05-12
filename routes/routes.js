// routes/scrapeRoutes.js
const express = require('express');
const router = express.Router();

const hashAddressesController = require("../controllers/places_controller");


// web hooks
// router.post('/webhook/google-map-data',webhooks.googleMapDataWebHook);
// router.post('/places',PlacesController.insertPlaces);


router.post('/find-place', hashAddressesController.queryPlaces);

router.get('/bulk-places', hashAddressesController.insertPlaces);


module.exports = router;