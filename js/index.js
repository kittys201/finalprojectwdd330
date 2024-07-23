$(document).ready(function() {
  // Verificar si es la primera visita
  if(!localStorage.getItem('visited')) {
    alert("Welcome! This is your first visit.");
    localStorage.setItem('visited', 'true');
}

// Verificar si hay búsquedas anteriores guardadas en el local storage
if(localStorage.getItem('previousSearches')) {
    // Si hay búsquedas anteriores, mostrarlas en la sección "Búsquedas anteriores"
    displayPreviousSearches();
}
  var item, tile, author, publisher, bookLink, bookImg;
  var outputList = document.getElementById("list-output");
  var comparisonOutput = document.getElementById("comparison-output");
  var readingListOutput = document.getElementById("reading-list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var apiKey = "AIzaSyDXyR5j8ZTwRqYFz0UUPQoKtetBIkyl-v8";
  var placeHldr = '<img src="https://via.placeholder.com/150">';
  var searchData;
  var bookOptions = [];

  $("#search").click(function() {
      outputList.innerHTML = ""; //empty html output
      document.body.style.backgroundImage = "url('')";
      searchData = $("#search-box").val();
      if (searchData === "" || searchData === null) {
          displayError();
      } else {
          $.ajax({
              url: bookUrl + searchData,
              dataType: "json",
              success: function(response) {
                  if (response.totalItems === 0) {
                      alert("no result!.. try again");
                  } else {
                      $("#title").animate({'margin-top': '5px'}, 1000); //search box animation
                      $(".book-list").css("visibility", "visible");
                      displayResults(response);
                      populateBookOptions(); // Llenar las listas desplegables con los resultados de la búsqueda
                  }
              },
              error: function () {
                  alert("Something went wrong.. Try again!");
              }
          });
      }
      $("#search-box").val(""); //clear search box
  });

  function displayResults(response) {
      for (var i = 0; i < response.items.length; i+=2) {
          item = response.items[i];
          var title1 = item.volumeInfo.title;
          var author1 = item.volumeInfo.authors;
          var publisher1 = item.volumeInfo.publisher;
          var bookLink1 = item.volumeInfo.previewLink;
          var bookIsbn = "";
          if (item.volumeInfo.industryIdentifiers) {
            var isbnObj = item.volumeInfo.industryIdentifiers.find(function(identifier) {
              return identifier.type === "ISBN_13";
            });
            if (isbnObj) {
              bookIsbn = isbnObj.identifier;
            }
          }
          var bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;

          var item2 = response.items[i+1];
          var title2 = item2.volumeInfo.title;
          var author2 = item2.volumeInfo.authors;
          var publisher2 = item2.volumeInfo.publisher;
          var bookLink2 = item2.volumeInfo.previewLink;
          var bookIsbn2 ="" ;
          if (item.volumeInfo.industryIdentifiers) {
            var isbnObj = item.volumeInfo.industryIdentifiers.find(function(identifier) {
              return identifier.type === "ISBN_14";
            });
            if (isbnObj) {
              bookIsbn2 = isbnObj.identifier;
            }
          }
          var bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr;

          bookOptions.push(item);
          bookOptions.push(item2);

          outputList.innerHTML += '<div class="row mt-4">' +
                                  formatOutput(bookImg1, title1, author1, publisher1, bookLink1, bookIsbn, i) +
                                  formatOutput(bookImg2, title2, author2, publisher2, bookLink2, bookIsbn2, i+1) +
                                  '</div>';
      }
      saveSearch();
      saveSearch(searchData);
  }

  function formatOutput(bookImg, title, author, publisher, bookLink, bookIsbn, index) {
      var viewUrl = 'book.html?isbn='+bookIsbn; //constructing link for bookviewer
      var htmlCard = `<div class="col-lg-6">
          <div class="card">
              <div class="row no-gutters">
                  <div class="col-md-4">
                      <img src="${bookImg}" class="card-img" alt="...">
                  </div>
                  <div class="col-md-8">
                      <div class="card-body">
                          <h5 class="card-title">${title}</h5>
                          <p class="card-text">Author: ${author}</p>
                          <p class="card-text">Publisher: ${publisher}</p>
                          <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
                          <button onclick="addToReadingList(${index})" class="btn btn-primary">Add to Reading List</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
      return htmlCard;
  }

  function displayError() {
      alert("search term can not be empty!");
  }

  function populateBookOptions() {
      var compareBook1 = document.getElementById("compare-book-1");
      var compareBook2 = document.getElementById("compare-book-2");

      compareBook1.innerHTML = "";
      compareBook2.innerHTML = "";

      bookOptions.forEach(function(book, index) {
          var option = document.createElement("option");
          option.value = index;
          option.text = book.volumeInfo.title;
          compareBook1.add(option.cloneNode(true));
          compareBook2.add(option.cloneNode(true));
      });
  }

  $("#compare-books").click(function() {
      var book1Index = $("#compare-book-1").val();
      var book2Index = $("#compare-book-2").val();

      if (book1Index !== "" && book2Index !== "" && book1Index !== book2Index) {
          var book1 = bookOptions[book1Index];
          var book2 = bookOptions[book2Index];
          compareBooks(book1, book2);
      } else {
          alert("Please select two different books to compare.");
      }
  });

  function compareBooks(book1, book2) {
      comparisonOutput.innerHTML = `<div>
          <h3>Comparison Result</h3>
          <p><strong>${book1.volumeInfo.title}</strong> 🆚 <strong>${book2.volumeInfo.title}</strong></p>
          <p>Author: ${book1.volumeInfo.authors.join(', ')} 🆚 ${book2.volumeInfo.authors.join(', ')}</p>
          <p>Publisher: ${book1.volumeInfo.publisher} 🆚 ${book2.volumeInfo.publisher}</p>
          <p>Page Count: ${book1.volumeInfo.pageCount} 🆚 ${book2.volumeInfo.pageCount}</p>
          <p>Published Date: ${book1.volumeInfo.publishedDate} 🆚 ${book2.volumeInfo.publishedDate}</p>
      </div>`;
  }

  window.addToReadingList = function(index) {
      var book = bookOptions[index];
      readingListOutput.innerHTML += `<div class="card">
          <div class="row no-gutters">
              <div class="col-md-4">
                  <img src="${book.volumeInfo.imageLinks.thumbnail}" class="card-img" alt="...">
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h5 class="card-title">${book.volumeInfo.title}</h5>
                      <p class="card-text">Author: ${book.volumeInfo.authors.join(', ')}</p>
                      <p class="card-text">Publisher: ${book.volumeInfo.publisher}</p>
                      <button onclick="removeFromReadingList(this)" class="btn btn-danger">Remove</button>
                  </div>
              </div>
          </div>
      </div>`;
  }

  window.removeFromReadingList = function(element) {
      element.parentElement.parentElement.parentElement.parentElement.remove();
  }

  function saveSearch(searchTerm) {
    // Recuperar las búsquedas anteriores del almacenamiento local
    var previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];
  
    // Agregar la nueva búsqueda al principio del arreglo
    previousSearches.unshift(searchTerm);
  
    // Limitar el número de búsquedas anteriores a 10
    previousSearches = previousSearches.slice(0, 10);
  
    // Guardar las búsquedas anteriores en el almacenamiento local
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
  }


  
  function displayPreviousSearches() {
    // Recuperar las búsquedas anteriores del almacenamiento local
    var previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

    // Limpiar el contenedor HTML
    $("#previous-searches").empty();

    // Agregar cada búsqueda al contenedor HTML
    previousSearches.forEach(function(searchTerm, index) {
        var searchLink = $("<a>").text(searchTerm).attr("href", "#");
        searchLink.click(function(event) {
            event.preventDefault();
            $("#search-box").val(searchTerm);
            $("#search").click();
        });
        var closeIcon = $("<span>").text(" ✖").attr("data-index", index);
        closeIcon.click(function(event) {
            event.preventDefault();
            var index = $(this).attr("data-index");
            previousSearches.splice(index, 1);
            localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
            displayPreviousSearches();
        });
        $("#previous-searches").append(searchLink);
        $("#previous-searches").append(closeIcon);
        $("#previous-searches").append(" ");
    });
}

$("#clear-searches").click(function() {
  localStorage.removeItem("previousSearches");
  displayPreviousSearches();
});

});