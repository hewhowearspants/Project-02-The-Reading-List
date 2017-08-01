$(() => {
  console.log('main.js loaded');
  const form = $('#bookstore-request');
  form.on('submit', (event) => getBookstores(event));

  function getBookstores(event) {
    event.preventDefault();

    console.log('zip accepted! ' + event.target.zip.value);

    fetch(`books/stores/${event.target.zip.value}`)
      .then((fetchRes) => { 
        console.log(fetchRes);
        window.location = `books/stores/${event.target.zip.value}`;
      });
  };

});