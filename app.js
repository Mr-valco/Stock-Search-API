// Initial array of stocks
const stocks = ['FB', 'AAPL', 'TSLA', 'GOOG', 'GE'];

// displaystockInfo function re-renders the HTML to display the appropriate content
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=logo,quote,news&range=1m&last=10`;
  //https://api.iextrading.com/1.0/ref-data/symbols the link to all stock simbols to compare

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    $('#stocks-view').empty();
    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');
    const logoDiv = $('#stocks-logo').addClass('stock-logo');
    // Storing the company name
    const companyName = response.quote.companyName;
    // Storing the stock symbol
    const stockSymbol = response.quote.symbol;
    // Storing the price
    const stockPrice = response.quote.latestPrice;
    // Storing the first news summary
    const companyNews = response.news[0].summary;
    const logo = response.logo.url;
    const articleUrl = response.news[0].url;

    $('#stocks-view').prepend(`<div class="jumbotron">
    <div class="row">
      <div class="col-sm-3">
        <img src="${logo}" alt="Card image">
      </div>
      <br>
      <div class="col-sm-9">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Stock Symbol: ${stockSymbol}</li>
          <li class="list-group-item"> Stock Price: $${stockPrice}</li>
        </ul>
      </div>
    </div>
    <div class="card my-3">
      <h5 class="card-header">${companyName}</h5>
      <div class="card-body">
        <p class="card-text">${companyNews}</p>
      </div>
      <div class="card-footer">
        <a href="${articleUrl}" class="card-link" target="_blank">More Info</a>
      </div>
    </div>
  </div>`);

  });

}


// Function for displaying stock data
const render = function () {

  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();

  // Looping through the array of stocks
  for (let i = 0; i < stocks.length; i++) {

    // Then dynamicaly generating buttons for each stock in the array
    // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
    const newButton = $('<button class="btn-block btn-outline-primary p-1 m-2">');

    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');

    // Adding a data-attribute
    newButton.attr('data-name', stocks[i]);

    // Providing the initial button text
    newButton.text(stocks[i]);

    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function (event) {

  // event.preventDefault() prevents the form from trying to submit itself.
  // We're using a form so that the user can hit enter instead of clicking the button if they want
  event.preventDefault();

  // This line will grab the text from the input box
  const stock = $('#stock-input').val().trim();

  // The stock from the textbox is then added to our array
  stocks.push(stock);

  // Deletes the contents of the input
  $('#stock-input').val('');

  // calling render which handles the processing of our stock array
  render();
}
// Even listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Calling the renderButtons function to display the intial buttons
render();