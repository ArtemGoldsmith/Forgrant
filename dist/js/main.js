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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGN1c3RvbSBzZWxlY3RcbnZhciB4LCBpLCBqLCBzZWxFbG1udCwgYSwgYiwgYztcbnggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY3VzdG9tLXNlbGVjdFwiKTtcbmZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gIHNlbEVsbW50ID0geFtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNlbGVjdFwiKVswXTtcbiAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gIGEuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzZWxlY3Qtc2VsZWN0ZWRcIik7XG4gIGEuaW5uZXJIVE1MID0gc2VsRWxtbnQub3B0aW9uc1tzZWxFbG1udC5zZWxlY3RlZEluZGV4XS5pbm5lckhUTUw7XG4gIHhbaV0uYXBwZW5kQ2hpbGQoYSk7XG4gIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICBiLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic2VsZWN0LWl0ZW1zIHNlbGVjdC1oaWRlXCIpO1xuICBmb3IgKGogPSAwOyBqIDwgc2VsRWxtbnQubGVuZ3RoOyBqKyspIHtcbiAgICBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICBjLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic2VsZWN0LWl0ZW1zX19jdXJyZW5jeVwiKTtcbiAgICBjLmlubmVySFRNTCA9IHNlbEVsbW50Lm9wdGlvbnNbal0uaW5uZXJIVE1MO1xuICAgIGMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciB5LCBpLCBrLCBzLCBoO1xuICAgICAgcyA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2VsZWN0XCIpWzBdO1xuICAgICAgaCA9IHRoaXMucGFyZW50Tm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocy5vcHRpb25zW2ldLmlubmVySFRNTCA9PSB0aGlzLmlubmVySFRNTCkge1xuICAgICAgICAgIHMuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgaC5pbm5lckhUTUwgPSB0aGlzLmlubmVySFRNTDtcbiAgICAgICAgICB5ID0gdGhpcy5wYXJlbnROb2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzYW1lLWFzLXNlbGVjdGVkXCIpO1xuICAgICAgICAgIGZvciAoayA9IDA7IGsgPCB5Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICB5W2tdLmNsYXNzTGlzdC5yZW1vdmUoXCJzYW1lLWFzLXNlbGVjdGVkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJzYW1lLWFzLXNlbGVjdGVkXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBoLmNsaWNrKCk7XG4gICAgfSk7XG4gICAgYi5hcHBlbmRDaGlsZChjKTtcbiAgfVxuICB4W2ldLmFwcGVuZENoaWxkKGIpO1xuICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjbG9zZUFsbFNlbGVjdCh0aGlzKTtcbiAgICB0aGlzLm5leHRTaWJsaW5nLmNsYXNzTGlzdC50b2dnbGUoXCJzZWxlY3QtaGlkZVwiKTtcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJzZWxlY3QtYXJyb3ctYWN0aXZlXCIpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNsb3NlQWxsU2VsZWN0KGVsbW50KSB7XG4gIHZhciB4LCB5LCBpLCBhcnJObyA9IFtdO1xuICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGVjdC1pdGVtc1wiKTtcbiAgeSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzZWxlY3Qtc2VsZWN0ZWRcIik7XG4gIGZvciAoaSA9IDA7IGkgPCB5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVsbW50ID09IHlbaV0pIHtcbiAgICAgIGFyck5vLnB1c2goaSlcbiAgICB9IGVsc2Uge1xuICAgICAgeVtpXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0LWFycm93LWFjdGl2ZVwiKTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYXJyTm8uaW5kZXhPZihpKSkge1xuICAgICAgeFtpXS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWhpZGVcIik7XG4gICAgfVxuICB9XG59XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VBbGxTZWxlY3QpO1xuXG4vLyBjdXJyZW5jeSBpbmZvXG5jb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGl2Mi5iaXRjb2luYXZlcmFnZS5jb20vaW5kaWNlcy9nbG9iYWwvdGlja2VyLyc7XG5sZXQgY3J5cHRvQ3VycmVuY2llcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2N1cnJlbmN5LWJsb2Nrc19fYmxvY2snKTtcbmxldCBjdXJyZW5jaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0LWl0ZW1zX19jdXJyZW5jeScpO1xubGV0IGNyeXB0b0N1cnJlbmNpZXNBcnJheSA9IFtdO1xubGV0IGN1cnJlbmNpZXNBcnJheSA9IFtdO1xuXG5mb3IgKCBsZXQgaSA9IDA7IGkgPCBjdXJyZW5jaWVzLmxlbmd0aDsgaSsrICkge1xuICBjdXJyZW5jaWVzQXJyYXkucHVzaChjdXJyZW5jaWVzW2ldLmlubmVySFRNTC50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZm9yICggbGV0IGkgPSAwOyBpIDwgY3J5cHRvQ3VycmVuY2llcy5sZW5ndGg7IGkrKyApIHtcbiAgY3J5cHRvQ3VycmVuY2llc0FycmF5LnB1c2goY3J5cHRvQ3VycmVuY2llc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvcnRjb2RlJykudG9VcHBlckNhc2UoKSk7XG4gIGdldEN1cnJlbnRDdXJyZW5jeShjcnlwdG9DdXJyZW5jaWVzQXJyYXlbaV0pO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q3VycmVuY3koY3J5cHRvQ3VycmVuY3kpIHtcbiAgbGV0IGN1cnJlbnRDdXJyZW5jeSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdC1zZWxlY3RlZCcpWzBdLnRleHRDb250ZW50LnRvVXBwZXJDYXNlKCk7XG4gIGdldENyeXB0b0N1cnJlbmNpZXMoY3J5cHRvQ3VycmVuY3ksIGN1cnJlbnRDdXJyZW5jeSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW5jcmVhc2VEZWNyZWFzZShkYXRhLCBpZCwgc3ltYm9sKSB7XG4gIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gIGlmICggZGF0YSA8IDAgKSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBkYXRhICsgc3ltYm9sO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xhc3MnLCAnZGVjcmVhc2UnKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NsYXNzJywgJ2luY3JlYXNlJyk7XG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIitcIiArIGRhdGEgKyBzeW1ib2w7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjbGFzcycsICdpbmNyZWFzZScpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY2xhc3MnLCAnZGVjcmVhc2UnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBDdXJyZW5jeShob3VyLCBkYXksIHdlZWssIG1vbnRoLCBjdXJyZW5jeSwgc3ltYm9sKSB7XG4gIHRoaXMuaG91ciA9IGhvdXI7XG4gIHRoaXMuZGF5ID0gZGF5O1xuICB0aGlzLndlZWsgPSB3ZWVrO1xuICB0aGlzLm1vbnRoID0gbW9udGg7XG4gIHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuICB0aGlzLmdldEluZm8gPSBmdW5jdGlvbigpIHtcbiAgICBjaGVja0luY3JlYXNlRGVjcmVhc2UodGhpcy5ob3VyLCAnaG91cicgKyBjdXJyZW5jeSwgdGhpcy5zeW1ib2wpO1xuICAgIGNoZWNrSW5jcmVhc2VEZWNyZWFzZSh0aGlzLmRheSwgJ2RheScgKyBjdXJyZW5jeSwgdGhpcy5zeW1ib2wpO1xuICAgIGNoZWNrSW5jcmVhc2VEZWNyZWFzZSh0aGlzLndlZWssICd3ZWVrJyArIGN1cnJlbmN5LCB0aGlzLnN5bWJvbCk7XG4gICAgY2hlY2tJbmNyZWFzZURlY3JlYXNlKHRoaXMubW9udGgsICdtb250aCcgKyBjdXJyZW5jeSwgdGhpcy5zeW1ib2wpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUHJpY2VUeXBlKHByaWNlLCBwZXJjZW50YWdlLCB0b2dnbGUsIGN1cnJlbmN5KSB7XG4gIGxldCBjdXJyZW50Q3VycmVuY3kgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3Qtc2VsZWN0ZWQnKVswXS50ZXh0Q29udGVudC50b1VwcGVyQ2FzZSgpO1xuICBsZXQgY3VycmVuY3lTeW1ib2w7XG5cbiAgaWYgKCBjdXJyZW50Q3VycmVuY3kgPT09ICdVU0QnICkge1xuICAgIGN1cnJlbmN5U3ltYm9sID0gJyQnO1xuICB9IGVsc2UgaWYgKCBjdXJyZW50Q3VycmVuY3kgPT09ICdFVVInICkge1xuICAgIGN1cnJlbmN5U3ltYm9sID0gJ+KCrCc7XG4gIH0gZWxzZSBpZiAoIGN1cnJlbnRDdXJyZW5jeSA9PT0gJ1JVQicgKSB7XG4gICAgY3VycmVuY3lTeW1ib2wgPSAn4oK9JztcbiAgfSBlbHNlIGlmICggY3VycmVudEN1cnJlbmN5ID09PSAnR0JQJyApIHtcbiAgICBjdXJyZW5jeVN5bWJvbCA9ICfCoyc7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVuY3lTeW1ib2wgPSAnJztcbiAgfVxuXG4gIGlmICggdG9nZ2xlICkge1xuICAgIGxldCBkYXRhID0gbmV3IEN1cnJlbmN5KHBlcmNlbnRhZ2UuaG91ciwgcGVyY2VudGFnZS5kYXksIHBlcmNlbnRhZ2Uud2VlaywgcGVyY2VudGFnZS5tb250aCwgY3VycmVuY3ksICclJyk7XG4gICAgZGF0YS5nZXRJbmZvKCk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGRhdGEgPSBuZXcgQ3VycmVuY3kocHJpY2UuaG91ciwgcHJpY2UuZGF5LCBwcmljZS53ZWVrLCBwcmljZS5tb250aCwgY3VycmVuY3ksIGN1cnJlbmN5U3ltYm9sKTtcbiAgICBkYXRhLmdldEluZm8oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRNYWluUHJpY2UobWFpblByaWNlLCBjcnlwdG9DdXJyZW5jeSwgY3VycmVudEN1cnJlbmN5KSB7XG4gIGlmICggY3VycmVudEN1cnJlbmN5ID09PSAnVVNEJyApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpblByaWNlJyArIGNyeXB0b0N1cnJlbmN5KS5pbm5lckhUTUwgPSAnJCcgKyBtYWluUHJpY2U7XG4gIH0gZWxzZSBpZiAoIGN1cnJlbnRDdXJyZW5jeSA9PT0gJ0VVUicgKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5QcmljZScgKyBjcnlwdG9DdXJyZW5jeSkuaW5uZXJIVE1MID0gJ+KCrCcgKyBtYWluUHJpY2U7XG4gIH0gZWxzZSBpZiAoIGN1cnJlbnRDdXJyZW5jeSA9PT0gJ1JVQicgKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5QcmljZScgKyBjcnlwdG9DdXJyZW5jeSkuaW5uZXJIVE1MID0gJ+KCvScgKyBtYWluUHJpY2U7XG4gIH0gZWxzZSBpZiAoIGN1cnJlbnRDdXJyZW5jeSA9PT0gJ0dCUCcgKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5QcmljZScgKyBjcnlwdG9DdXJyZW5jeSkuaW5uZXJIVE1MID0gJ8KjJyArIG1haW5QcmljZTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpblByaWNlJyArIGNyeXB0b0N1cnJlbmN5KS5pbm5lckhUTUwgPSBtYWluUHJpY2U7XG4gIH1cbn1cblxuXG5cbmZ1bmN0aW9uIGdldENyeXB0b0N1cnJlbmNpZXMoY3J5cHRvQ3VycmVuY3ksIGN1cnJlbnRDdXJyZW5jeSkge1xuICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgcmVxLm9wZW4oJ0dFVCcsIHVybCArIGNyeXB0b0N1cnJlbmN5ICsgY3VycmVudEN1cnJlbmN5LCB0cnVlKTtcbiAgcmVxLm9ubG9hZCAgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgcHJpY2VzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KS5jaGFuZ2VzLnByaWNlO1xuICAgIGxldCBwZXJjZW50YWdlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCkuY2hhbmdlcy5wZXJjZW50O1xuICAgIGxldCB0b2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjcnlwdG9DdXJyZW5jeSArICdQZXJjZW50VG9nZ2xlJyk7XG4gICAgbGV0IG1haW5QcmljZSA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCkubGFzdDtcbiAgICBzZXRNYWluUHJpY2UobWFpblByaWNlLCBjcnlwdG9DdXJyZW5jeSwgY3VycmVudEN1cnJlbmN5KTtcbiAgICBjaGVja1ByaWNlVHlwZShwcmljZXMsIHBlcmNlbnRhZ2VzLCB0b2dnbGUuY2hlY2tlZCwgY3J5cHRvQ3VycmVuY3kpO1xuICB9O1xuICByZXEuc2VuZChudWxsKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlUGVyY2VudGFnZShldmVudCkge1xuICBnZXRDdXJyZW50Q3VycmVuY3koZXZlbnQudGFyZ2V0LmNyeXB0b0N1cnJlbmN5KTtcbn1cblxuZnVuY3Rpb24gc2V0QWxsUHJpY2VzKCkge1xuICBsZXQgY3VycmVudEN1cnJlbmN5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0LXNlbGVjdGVkJylbMF0udGV4dENvbnRlbnQudG9VcHBlckNhc2UoKTtcbiAgZ2V0Q3J5cHRvQ3VycmVuY2llcygnRVRIJywgY3VycmVudEN1cnJlbmN5KTtcbiAgZ2V0Q3J5cHRvQ3VycmVuY2llcygnTFRDJywgY3VycmVudEN1cnJlbmN5KTtcbiAgZ2V0Q3J5cHRvQ3VycmVuY2llcygnQlRDJywgY3VycmVudEN1cnJlbmN5KTtcbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0VUSFBlcmNlbnRUb2dnbGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVBlcmNlbnRhZ2UsIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdFVEhQZXJjZW50VG9nZ2xlJykuY3J5cHRvQ3VycmVuY3kgPSAnRVRIJztcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdMVENQZXJjZW50VG9nZ2xlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVQZXJjZW50YWdlLCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnTFRDUGVyY2VudFRvZ2dsZScpLmNyeXB0b0N1cnJlbmN5ID0gJ0xUQyc7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQlRDUGVyY2VudFRvZ2dsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlUGVyY2VudGFnZSwgZmFsc2UpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0JUQ1BlcmNlbnRUb2dnbGUnKS5jcnlwdG9DdXJyZW5jeSA9ICdCVEMnO1xuXG5sZXQgc2VsZWN0SXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3QtaXRlbXNfX2N1cnJlbmN5Jyk7XG5mb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIHNlbGVjdEl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2V0QWxsUHJpY2VzLCBmYWxzZSk7XG59XG4iXSwiZmlsZSI6Im1haW4uanMifQ==
