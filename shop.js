let productDetails = {};
let searchStr = "";
let basket = {};
let categories = [];
let selectedQuantity = {};
//Each product is based on a 'card'; a box that contains information about that product.
//You can change the card template here. The [EVEGPRODUCT#] will always be subsituted for 
//the element in the imagesArr (see fruit.js)
//The classes can be styled using CSS
//The adjustDown and adjustUp buttons have their behaviour specified below, but you can change this if you like
//To change the quantity of a product, change the value of the input (with the class of buyInput), you can then recalculate the basket with refreshBasket()
//Or you can adjust the basket object via javascript and call updateQuantityInputs() and refreshBasket()
var cardTemplate = `<div class="shop-product card" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-title card__title" data-field="title" data-num="[EVEGPRODUCT#]"></div>
<div class="card__content" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-img" data-field="img" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-price" data-field="price" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-units" data-field="units" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-buying" data-num="[EVEGPRODUCT#]">
<div class="productBasketDiv"><button class="addToBasket">Add to Basket</button>
<div class="adjustDiv"><button class="btn adjustDown">-</button>
<input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0" type="number">
<button class="btn adjustUp">+</button></div></div></div></div></div>`;

function init() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const hero = document.getElementsByClassName('hero')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];
    
    // obtain reference to checkboxes named categories[]
    checkBox = document.forms['categoriesForm'].elements['categories[]'];

    // get basket from cookies
    // basket = JSON.parse(getCookie("basket"));

    // using reference to sports obtained above
    for (var i = 0, len = checkBox.length; i < len; i++) {
        checkBox[i].onclick = doSomething;
    }

    // access properties of checkbox clicked using 'this' keyword
    function doSomething() {
        if (this.checked) {
            categories.push(this.value)
        } else {
            const index = categories.indexOf(this.value);
            if (index > -1) {
                categories.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        redraw()
    }

    //When the toggle button is pressed (if visible by the screen size, the menu is shown)
    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
        hero.classList.toggle('menuactive');
    });

    // const searchBar = document.getElementsByClassName('search-container')[0];
    // //Show the search bar when the search link is pressed
    // //document.getElementById('search-link').addEventListener('click',()=>{
    // searchBar.classList.toggle('active');
    // document.getElementById('searchbox2').focus();
    //});

    //Search Function
    document.getElementById('searchbutton2').addEventListener('click', () => {
        searchStr = document.getElementById('searchbox2').value;
        redraw();
    });

    //This is the code for searching products with enter
    window.addEventListener('keydown', function(e) {
        if (e.key == 'Enter') {
            searchStr = document.getElementById('searchbox2').value;
            redraw();
        }
    })

    //Close the search bar
    // document.getElementById('closesearchbutton').addEventListener('click', ()=>{
    //   searchStr = "";
    //   searchBar.classList.remove('active');
    //   redraw();
    // });

    //Close the cookies message
    document.getElementById('acceptCookies').addEventListener('click', () => {
        setCookie('cookieMessageSeen', true);
        document.getElementById('cookieMessage').style.display = 'none';
    });

    if (getCookie("cookieMessageSeen") == "true") {
        document.getElementById('cookieMessage').style.display = 'none';
    }
    initProducts(redraw);
    refreshBasket();
    resetListeners();
}


/*
 * When changing the page, you should make sure that each adjust button has exactly one click event
 * (otherwise it might trigger multiple times)
 * So this function loops through each adjustment button and removes any existing event listeners
 * Then it adds another event listener
 */
function resetListeners() {
    var elements = document.getElementsByClassName("adjustUp");
    var eIn;
    for (eIn = 0; eIn < elements.length; eIn++) {
        elements[eIn].removeEventListener("click", inputIncrement);
        elements[eIn].addEventListener("click", inputIncrement);
    }
    elements = document.getElementsByClassName("adjustDown");
    for (eIn = 0; eIn < elements.length; eIn++) {
        elements[eIn].removeEventListener("click", inputDecrement);
        elements[eIn].addEventListener("click", inputDecrement);
    }

    elements = document.getElementsByClassName("addToBasket");
    for (eIn = 0; eIn < elements.length; eIn++) {
        elements[eIn].removeEventListener("click", calculateBasket);
        elements[eIn].addEventListener("click", calculateBasket);
    }
    document.getElementsByClassName("clearButton")[0].removeEventListener("click", clear);
    document.getElementsByClassName("clearButton")[0].addEventListener("click", clear);

}


//Change the value at the input box to newQuantity
function changeSelectedQuantity(productID, newQuantity) {
    // selectedQuantity[productID] = newQuantity;
    document.querySelector(".buyInput[data-num='" + productID + "']").value = newQuantity;
}

/*
 * Change the quantity of the product with productID
 */
function changeQuantity(productID, change) {
    if (basket[productID] === undefined) {
        basket[productID] = 0;
    }
    var newQuantity = basket[productID] + change;
    basket[productID] = parseInt(newQuantity);
    if (newQuantity <= 0)
        delete basket[productID];
    document.querySelector(".buyInput[data-num='" + productID + "']").value = newQuantity;
}

//Add 1 to the quantity
function inputIncrement(ev) {
    var curr = parseInt(ev.target.parentElement.children[1].value);
    ev.target.parentElement.children[1].value = curr + 1;
    // var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    // if (basket[thisID] === undefined) {
    //     basket[thisID] = 0;
    // }
    // changeQuantity(thisID, parseInt(basket[thisID]) + 1);
}

//Subtract 1 from the quantity
function inputDecrement(ev) {
    var curr = parseInt(ev.target.parentElement.children[1].value);
    ev.target.parentElement.children[1].value = curr - 1;
    // var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    // if (basket[thisID] === undefined) {
    //     changeQuantity(thisID, 0);
    // } else {
    //     if (basket[thisID] > 0) {
    //         changeQuantity(thisID, parseInt(basket[thisID]) - 1);
    //     }
    // }
}

function filterFunction(a) {
    if (!categories.length) return a.name.toLowerCase().includes(searchStr.toLowerCase());
    else {
        return (a.name.toLowerCase().includes(searchStr.toLowerCase()) && categories.includes(a.type));
    }

    //If you wanted to just filter based on fruit/veg you could do something like this:
    // return a.type == 'veg';
    // return a.type == 'fruit';
    // return true;
}

function sortFunction(a, b) {
    return a.price > b.price;
}

//Redraw all products based on the card template
function redraw() {

    //Reset the product list (there are possibly more efficient ways of doing this, but this is simplest)
    document.querySelector('.productList').innerHTML = '';

    var shownProducts = productDetails.filter(filterFunction);

    shownProducts.sort(sortFunction);

    var numProducts = shownProducts.length;

    for (var i = 0; i < numProducts; i++) {
        var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]", shownProducts[i].productID);
        var thisProduct = document.createElement("div");
        thisProduct.innerHTML = cardHTML;
        document.querySelector('.productList').appendChild(thisProduct.firstChild);
    }

    document.querySelectorAll(".shop-product-details").forEach(function(element) {
        var field = element.getAttribute("data-field");
        var num = element.getAttribute("data-num");
        switch (field) {
            case "title":
                element.innerText = productDetails[num].name;
                break;
            case "img":
                element.innerHTML = "<span class=\"imgspacer\"></span><img src=\"images/" + productDetails[num].image + "\"></img>";
                break;
            case "price":
                element.innerHTML = "<span>£" + (productDetails[num].price / 100).toFixed(2) + "</span>";
                break;
            case "units":
                element.innerHTML = "<span>" + productDetails[num].packsize + " " + productDetails[num].units + "</span>";
                break;
        }

    });
    resetListeners();
}

window.addEventListener("load", init);

function updateQuantityInputs() {
    var elements = document.getElementsByClassName("buyInput");
    var eIn;
    for (eIn = 0; eIn < elements.length; eIn++) {
        elements[eIn].value = 0;
    }
    // for (let buyInput of document.querySelectorAll(".buyInput")) {
    //     let quantity = basket[buyInput.getAttribute("data-num")];
    //     if (isNaN(quantity))
    //         quantity = 0;

    //     buyInput.value = quantity;
    // }
}

//Recalculate basket
function refreshBasket() {
    let total = 0;
    document.querySelector('.shoppingBasket').innerHTML = '';

    let rowHTML = `<th>Item</th>
                  <th>Amount</th>
                  <th>£ (per)</th>
                  <th>Total</th>`;
    var thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.shoppingBasket').appendChild(thisProduct);
    for (const productID in basket) {
        let quantity = basket[productID];
        let price = productDetails[productID].price;
        let productTotal = price * quantity;
        total = total + productTotal;
        let rowHTML = `<td class="bordered">${productDetails[productID].name}</td><td class="bordered">${quantity}</td><td class="bordered">${(price / 100).toFixed(2)}</td><td class="bordered">£${(productTotal / 100).toFixed(2)}</td>`;
        var thisProduct = document.createElement("tr");
        thisProduct.innerHTML = rowHTML;
        document.querySelector('.shoppingBasket').appendChild(thisProduct);
    }
    rowHTML = `<td>Total:</td><td></td><td></td><td>£${(total / 100).toFixed(2)}</td>`;
    thisProduct = document.createElement("tr");
    thisProduct.innerHTML = rowHTML;
    document.querySelector('.shoppingBasket').appendChild(thisProduct);

    // for (const productID in basket) {
    //     let quantity = basket[productID];
    //     let price = productDetails[productID].price;
    //     gTotal = gTotal + (price * quantity);
    // }
    // try {
    //     document.querySelector("#basketNumTotal").innerHTML = (total / 100).toFixed(2);
    // } catch (e) {

    // }
}

function clear() {
    basket = {}
    setCookie('basket', JSON.stringify(basket));
    refreshBasket();
}

//Code to add items to shopping basket
function calculateBasket(ev) {
    var change = parseInt(ev.target.parentElement.children[1].children[1].value);
    var pid = ev.target.parentElement.children[1].children[1].getAttribute("data-num");
    changeQuantity(pid, change);
    updateQuantityInputs();
    setCookie('basket', JSON.stringify(basket));
    refreshBasket();
}