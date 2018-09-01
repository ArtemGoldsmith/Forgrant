// custom select
var x, i, j, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    c = document.createElement("DIV");
    c.setAttribute("class", "select-items__currency");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
      var y, i, k, s, h;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      h = this.parentNode.previousSibling;
      for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          for (k = 0; k < y.length; k++) {
            y[k].classList.remove("same-as-selected");
          }
          this.classList.add("same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
document.addEventListener("click", closeAllSelect);

// currency info
const url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/';
let cryptoCurrencies = document.getElementsByClassName('currency-blocks__block');
let currencies = document.getElementsByClassName('select-items__currency');
let cryptoCurrenciesArray = [];
let currenciesArray = [];

for ( let i = 0; i < currencies.length; i++ ) {
  currenciesArray.push(currencies[i].innerHTML.toUpperCase());
}

for ( let i = 0; i < cryptoCurrencies.length; i++ ) {
  cryptoCurrenciesArray.push(cryptoCurrencies[i].getAttribute('data-shortcode').toUpperCase());
  getCurrentCurrency(cryptoCurrenciesArray[i]);
}

function getCurrentCurrency(cryptoCurrency) {
  let currentCurrency = document.getElementsByClassName('select-selected')[0].textContent.toUpperCase();
  getCryptoCurrencies(cryptoCurrency, currentCurrency);
}

function checkIncreaseDecrease(data, id, symbol) {
  let element = document.getElementById(id);

  if ( data < 0 ) {
    element.innerHTML = data + symbol;
    element.classList.add('class', 'decrease');
    element.classList.remove('class', 'increase');
  } else {
    element.innerHTML = "+" + data + symbol;
    element.classList.add('class', 'increase');
    element.classList.remove('class', 'decrease');
  }
}

function Currency(hour, day, week, month, currency, symbol) {
  this.hour = hour;
  this.day = day;
  this.week = week;
  this.month = month;
  this.symbol = symbol;
  this.getInfo = function() {
    checkIncreaseDecrease(this.hour, 'hour' + currency, this.symbol);
    checkIncreaseDecrease(this.day, 'day' + currency, this.symbol);
    checkIncreaseDecrease(this.week, 'week' + currency, this.symbol);
    checkIncreaseDecrease(this.month, 'month' + currency, this.symbol);
  }
}

function checkPriceType(price, percentage, toggle, currency) {
  let currentCurrency = document.getElementsByClassName('select-selected')[0].textContent.toUpperCase();
  let currencySymbol;

  if ( currentCurrency === 'USD' ) {
    currencySymbol = '$';
  } else if ( currentCurrency === 'EUR' ) {
    currencySymbol = '€';
  } else if ( currentCurrency === 'RUB' ) {
    currencySymbol = '₽';
  } else if ( currentCurrency === 'GBP' ) {
    currencySymbol = '£';
  } else {
    currencySymbol = '';
  }

  if ( toggle ) {
    let data = new Currency(percentage.hour, percentage.day, percentage.week, percentage.month, currency, '%');
    data.getInfo();
  } else {
    let data = new Currency(price.hour, price.day, price.week, price.month, currency, currencySymbol);
    data.getInfo();
  }
}

function setMainPrice(mainPrice, cryptoCurrency, currentCurrency) {
  if ( currentCurrency === 'USD' ) {
    document.getElementById('mainPrice' + cryptoCurrency).innerHTML = '$' + mainPrice;
  } else if ( currentCurrency === 'EUR' ) {
    document.getElementById('mainPrice' + cryptoCurrency).innerHTML = '€' + mainPrice;
  } else if ( currentCurrency === 'RUB' ) {
    document.getElementById('mainPrice' + cryptoCurrency).innerHTML = '₽' + mainPrice;
  } else if ( currentCurrency === 'GBP' ) {
    document.getElementById('mainPrice' + cryptoCurrency).innerHTML = '£' + mainPrice;
  } else {
    document.getElementById('mainPrice' + cryptoCurrency).innerHTML = mainPrice;
  }
}



function getCryptoCurrencies(cryptoCurrency, currentCurrency) {
  let req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open('GET', url + cryptoCurrency + currentCurrency, true);
  req.onload  = function() {
    let prices = JSON.parse(req.responseText).changes.price;
    let percentages = JSON.parse(req.responseText).changes.percent;
    let toggle = document.getElementById(cryptoCurrency + 'PercentToggle');
    let mainPrice = JSON.parse(req.responseText).last;
    setMainPrice(mainPrice, cryptoCurrency, currentCurrency);
    checkPriceType(prices, percentages, toggle.checked, cryptoCurrency);
  };
  req.send(null);
}

function togglePercentage(event) {
  getCurrentCurrency(event.target.cryptoCurrency);
}

function setAllPrices() {
  let currentCurrency = document.getElementsByClassName('select-selected')[0].textContent.toUpperCase();
  getCryptoCurrencies('ETH', currentCurrency);
  getCryptoCurrencies('LTC', currentCurrency);
  getCryptoCurrencies('BTC', currentCurrency);
}

document.getElementById('ETHPercentToggle').addEventListener('click', togglePercentage, false);
document.getElementById('ETHPercentToggle').cryptoCurrency = 'ETH';
document.getElementById('LTCPercentToggle').addEventListener('click', togglePercentage, false);
document.getElementById('LTCPercentToggle').cryptoCurrency = 'LTC';
document.getElementById('BTCPercentToggle').addEventListener('click', togglePercentage, false);
document.getElementById('BTCPercentToggle').cryptoCurrency = 'BTC';

let selectItems = document.getElementsByClassName('select-items__currency');
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener('click', setAllPrices, false);
}
