// Initial array of stocks
const stocksList = [
  {
    symbol: 'FB',
    name: 'Facebook'
  },
  {
    symbol: 'AAPL',
    name: 'Apple'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla'
  },
  {
    symbol: 'GOOG',
    name: 'Alphabet'
  },
  {
    symbol: 'GE',
    name: 'General Electric'
  }
];
const validationList = [];
// displaystockInfo function re-renders the HTML to display the appropriate content
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=logo,quote,news&range=1m&last=10`;

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

    const logo = response.logo.url;
    // clearing the value and displaying company name for each company
    $('#co-name').empty();
    $('#co-name').append(`${companyName}`);
    //displaying logo and simbol, price
    $('#stocks-view').prepend(`
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
    `);
    //looping through 10 atricles
    for (let i = 0; i < response.news.length; i++) {
      $('#stocks-view').append(`
        <div class="card my-3">
        <h5 class="card-header">Article ${i + 1}</h5>
        <div class="card-body">
           <!-- articles get populated here -->
           <p class="card-text">${response.news[i].summary}</p>
        </div>
        <div class="card-footer">
         <!-- article url population -->
         <a href="${response.news[i].url}" class="card-link" target="_blank">More Info</a>
        </div>
      </div>`);
    }

  });

}
 //https://api.iextrading.com/1.0/ref-data/symbols the link to all stock simbols to compare
// Get list of available stock symbols from API on page load and store them in an object array.
$.get('https://api.iextrading.com/1.0/ref-data/symbols', function (response) {
  response.forEach(element => {
    validationList.push({
      'symbol': element.symbol.toUpperCase(),
      'name': element.name
    });
  });
});


// Function for displaying stock data
const render = function () {
  // Deleting the stocks prior to adding new stocks
  $('#buttons-view').empty();
  // Looping through the array of stocks
  for (let i = 0; i < stocksList.length; i++) {
    // Then dynamicaly generating buttons for each stock in the array
    const newButton = $('<button class="btn-block btn-outline-success p-1 m-2">');
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');
    // Adding a data-attribute
    newButton.attr('data-name', stocksList[i].symbol);
    // Providing the initial button text
    newButton.text(stocksList[i].symbol);
    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function (event) {
  // event.preventDefault() prevents the form from trying to submit itself.
  event.preventDefault();

  let userInput = $('#stock-input').val().toUpperCase();
  validationList.forEach(item => {
    // If userInput matches validationList item, push the item to the stockList array.
    if (userInput === item.symbol) {
      stocksList.push({
        symbol: item.symbol,
        name: item.name
      });
      displayStockInfo();
      alert(' The symbol you entered matches: ' + item.name + ' --- adding to list');
    }

  });
  // Reset the userInput field.
  $('#stock-input').val('');

  render();
}


// Even listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Calling the renderButtons function to display the intial buttons
render();