require('isomorphic-fetch');
require('dotenv').config();

const GOOGLE_GEOCODE_KEY = process.env.GOOGLE_GEOCODE_KEY;
const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY;
const GOOGLE_BOOKS_KEY = process.env.GOOGLE_BOOKS_KEY;

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
          placeId: store.place_id,
        });
      };
      console.log(res.locals.stores);
      next();
    });
};

function getBooks (req, res, next) {
  const query = req.params.query;
  console.log('getting books from Google...');
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_KEY}`)
    .then((fetchRes) => {
      return fetchRes.json();
    }).then((jsonRes) => {
      let results = jsonRes.items;
      res.locals.books = [];
      let searchId = 1;
      for (let book of results) {
        res.locals.books.push({
          title: book.volumeInfo.title ? book.volumeInfo.title : null,
          author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : null,
          year: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.slice(0,4) : null,
          genre: book.volumeInfo.categories ? book.volumeInfo.categories[0] : null,
          shortDescription: book.searchInfo ? book.searchInfo.textSnippet : null,
          description: book.volumeInfo.description ? book.volumeInfo.description : null,
          searchId: searchId,
        });
        console.log(book.volumeInfo.title, searchId);
        searchId++;
      };
      // console.log(res.locals.books);
      next();
    });

}

module.exports = {
  getGeocode: getGeocode,
  getBookstores: getBookstores,
  getBooks: getBooks,
};