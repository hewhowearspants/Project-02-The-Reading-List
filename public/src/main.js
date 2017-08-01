$(() => {
  console.log('main.js loaded');
  const bookstoreForm = $('#bookstore-request');
  const bookForm = $('#book-request');
  bookstoreForm.on('submit', (event) => getBookstores(event));
  bookForm.on('submit', (event) => getBooks(event));

  function getBookstores(event) {
    event.preventDefault();

    console.log('zip accepted! ' + event.target.zip.value);

    fetch(`/books/stores/${event.target.zip.value}`)
      .then((fetchRes) => { 
        console.log(fetchRes);
        window.location = `/books/stores/${event.target.zip.value}`;
      });
  };

  function getBooks(event) {
    event.preventDefault();

    console.log('query accepted! ' + event.target.query.value);

    fetch(`/books/search/${event.target.query.value}`)
      .then((fetchRes) => {
        console.log(fetchRes);
        window.location = `/books/search/${event.target.query.value}`;
      });
  };

});