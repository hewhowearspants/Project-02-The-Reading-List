require('isomorphic-fetch');
require('dotenv').config();

const GOOGLE_GEOCODE_KEY = process.env.GOOGLE_GEOCODE_KEY;
const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY;

function getGeocode (req, res, next) {
  const zipCode = req.params.zip;
  console.log('getting lat & long for ' + zipCode);
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_GEOCODE_KEY}`)
    .then((fetchRes) => {
      return fetchRes.json();
    })
    .then((jsonRes) => {
      // console.log(JSON.stringify(jsonRes.results[0].geometry.location));
      res.locals.location = jsonRes.results[0].geometry.location;
      next();
    })
};

function getBookstores (req, res, next) {
  const location = res.locals.location;
  console.log('getting bookstores...');
  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_PLACES_KEY}&location=${location.lat},${location.lng}&rankby=distance&type=book_store`)
    .then((fetchRes) => {
      return fetchRes.json();
    }).then((jsonRes) => {
      // console.log(jsonRes.results.);
      res.locals.stores = [];
      for (let store of jsonRes.results) {
        res.locals.stores.push({
          name: store.name,
          address: store.vicinity,
        });
      };
      console.log(res.locals.stores);
      next();
    });
};

module.exports = {
  getGeocode: getGeocode,
  getBookstores: getBookstores,
};