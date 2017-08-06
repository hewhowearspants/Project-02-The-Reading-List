$(() => {
  console.log('main.js loaded');
  const $bookstoreForm = $('.bookstore-request');
  const $bookForm = $('.book-request');
  const $changePasswordInput = $('#change-password-input');
  const $confirmPasswordInput = $('#confirm-password-input');
  const $buttons = $('button');

  // event listener reveals button labels on button hover, if applicable
  $buttons.hover(
    (e) => { 
      let $thisButton = $(e.target);
      let $thisForm = $thisButton.parent();
      $thisForm.find('.button-label').removeClass('hidden'); 
    },
    (e) => { 
      let $thisButton = $(e.target);
      let $thisForm = $thisButton.parent();
      $thisForm.find('.button-label').addClass('hidden');  
    }
  );
  
  // event listeners for API search fields
  $bookstoreForm.on('submit', (event) => getBookstores(event));
  $bookForm.on('submit', (event) => getBooks(event));

  $bookstoreForm.on('focusin', () => {
    $bookstoreForm.css('border-radius', '0px');
    $bookstoreForm.css('border-color', 'rgba(255,255,255,1)');
    $bookstoreForm.css('background-color', 'rgba(200,200,200,.75)');
    $bookstoreForm.children().css('color', 'black');
  });
  $bookstoreForm.on('focusout', () => {
    $bookstoreForm.css('border-radius', '');
    $bookstoreForm.css('border-color', '');
    $bookstoreForm.css('background-color', '');
    $bookstoreForm.children().css('color', '');
  });
  $bookForm.on('focusin', () => {
    $bookForm.css('border-radius', '0px');
    $bookForm.css('border-color', 'rgba(255,255,255,1)');
    $bookForm.css('background-color', 'rgba(200,200,200,.75)');
    $bookForm.children().css('color', 'black');
  });
  $bookForm.on('focusout', () => {
    $bookForm.css('border-radius', '');
    $bookForm.css('border-color', '');
    $bookForm.css('background-color', '');
    $bookForm.children().css('color', '');
  });

  // event listeners when user tries to change password
  $confirmPasswordInput.on('input', confirmPassword);
  $changePasswordInput.on('input', confirmPassword);

  // gets ZIP code from input field, uses value in URL, fires applicable routes in book-routes.js
  function getBookstores(event) {
    event.preventDefault();
    if (event.target.zip.value.length === 5) {
      console.log('zip accepted! ' + event.target.zip.value);

      fetch(`/books/stores/${event.target.zip.value}`)
        .then((fetchRes) => { 
          console.log(fetchRes);
          window.location = `/books/stores/${event.target.zip.value}`;
        });
    };
  };

  // gets book search query of input field, uses value in URL, fires applicable routes in book-routes.js
  function getBooks(event) {
    event.preventDefault();
    if (event.target.query.value) {
      console.log('query accepted! ' + event.target.query.value);

      fetch(`/books/search/${event.target.query.value}`)
        .then((fetchRes) => {
          console.log(fetchRes);
          window.location = `/books/search/${event.target.query.value}`;
        });
    }
  };

  // if two passwords match, enable button and change its appearance
  function confirmPassword() {
    event.preventDefault();
    let $changeButton = $('#change-password-button');
    let confirmPass = $('#confirm-password-input').val();
    let newPass = $('#change-password-input').val();

    console.log(confirmPass);
    console.log(newPass);
    if (confirmPass === newPass) {
      $changeButton.removeAttr('disabled');
      $changeButton.html('<i class="fa fa-share" aria-hidden="true"></i><i class="fa fa-lock" aria-hidden="true"></i>');
    } else {
      $changeButton.attr('disabled', true);
      $changeButton.html('<i class="fa fa-ban" aria-hidden="true"></i> <i class="fa fa-lock" aria-hidden="true"></i>');
    };
  };

});