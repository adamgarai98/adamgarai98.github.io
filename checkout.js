let productDetails = {};
let basket = {};
let creditCardShown = false;

/*
* When the page is loaded, initialise the products and reset the listeners
*/
function init(){
  //initProducts takes a callback function - when the products are loaded the basket will be recalculated
  basket = JSON.parse(getCookie("basket"));
  initProducts(calculateBasket);
  resetListeners();
}

//When changing the page, you should make sure that each adjust button has exactly one click event
//(otherwise it might trigger multiple times)
function resetListeners(){
  document.getElementById("paycreditcard").removeEventListener("click",showCreditCardPage);
  document.getElementById("paycreditcard").addEventListener('click',showCreditCardPage);
  var elements = document.getElementsByClassName("adjustUp");
  var eIn;
  for (eIn = 0; eIn < elements.length; eIn++) {
      elements[eIn].removeEventListener("click", increment);
      elements[eIn].addEventListener("click", increment);
  }
  elements = document.getElementsByClassName("adjustDown");
  for (eIn = 0; eIn < elements.length; eIn++) {
      elements[eIn].removeEventListener("click", decrement);
      elements[eIn].addEventListener("click", decrement);
  }
}

//When the pay by credit card link is clicked, show the creditcard.html in an iframe
function showCreditCardPage(){
  if(!creditCardShown){
    var payIFrame = document.createElement("iframe");
    payIFrame.src = "creditcard.html";
    payIFrame.width = "50%";
  
    document.querySelector('#customerDetails').appendChild(payIFrame);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".form__input").forEach(function(input) {
    input.addEventListener("input", function() {
      input.className = input.className.replace(/form__input--error ?/, "");
    });
  });
});


/*
* Calculate the totals and show the basket
*/
function calculateBasket(){
  let total = 0;
  document.querySelector('.checkoutList').innerHTML = '';
  let headingsHTML = `<td></td><td>Item</td><td>Quantity</td><td>Price</td><td>Total Price</td><td></td>`;
  var thisHeadings = document.createElement("tr");
  thisHeadings.innerHTML = headingsHTML;
  document.querySelector('.checkoutList').appendChild(thisHeadings);


  for(const productID in basket){
    let quantity = basket[productID];
    let price = productDetails[productID].price;
    let productTotal = price * quantity;
    total = total + productTotal;
    let rowHTML = `<td><button class="adjustDown" id="${productID}">-</button></td>
                  <td>${productDetails[productID].name}</td>
                  <td>${quantity}</td>
                  <td>${(price / 100).toFixed(2)}</td>
                  <td>£${(productTotal / 100).toFixed(2)}</td>
                  <td><button class="adjustUp" id="${productID}">+</button></td>`;
    var thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.checkoutList').appendChild(thisProduct);
  }
  let rowHTML = `<td colspan="4"><br>Total:</br></td><td><br>£${(total / 100).toFixed(2)}</br></td>`;
  var thisProduct = document.createElement("tr");
  thisProduct.innerHTML = rowHTML;
  document.querySelector('.checkoutList').appendChild(thisProduct);
  setCookie('basket', JSON.stringify(basket));
}


function changeQuantity(productID, newQuantity) {
  basket[productID] = newQuantity;
  if (newQuantity == 0)
      delete basket[productID];
  calculateBasket()
  resetListeners()
}

//Add 1 to the quantity
function increment(ev) {
  var thisID = ev.target.id;
  if (basket[thisID] === undefined) {
      basket[thisID] = 0;
  }
  changeQuantity(thisID, parseInt(basket[thisID]) + 1);
}

//Subtract 1 from the quantity
function decrement(ev) {
  var thisID = ev.target.id;
  if (basket[thisID] === undefined) {
      basket[thisID] = 0;
  }
  changeQuantity(thisID, parseInt(basket[thisID]) - 1);
}


window.addEventListener("load", init);