
// variables for cart totals
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];
// array of dictionary objects with full size names, size letters, and prices
let sizePrices = [
    {
        size: "Extra Small",
        letter: "XS",
        price: 19.99,
        availability: "In Stock"
    },
    {
        size: "Small",
        letter: "S",
        price: 21.99,
        availability: "In Stock"
    },
    {
        size: "Medium",
        letter: "M",
        price: 23.99,
        availability: "In Stock"
    },
    {
        size: "Large",
        letter: "L",
        price: 25.99,
        availability: "Out of Stock"
    },
    {
        size: "Extra Large",
        letter: "XL",
        price: 27.99,
        availability: "Out of Stock"
    },
    {
        size: "Extra Extra Large",
        letter: "XXL",
        price: 29.99,
        availability: "In Stock"
    }
]
addSelectOptions();
updateCartArr();

function preventPageReload(e){
    e.preventDefault();
}
document.getElementById("add-to-cart-btn").addEventListener(
    onclick, preventPageReload);

// grabs localStorage strings and converts them to dict objects for 
// easier operations
function updateCartArr(){
    subtotal = 0;
    shoppingCartItems = [];
    for (let i = 0; i < localStorage.length; i++){
    
        let workingDict = {};
        let workingStr = "";
        let str = localStorage.getItem("cartItem" + i);
    
        workingStr = str.split(",");
        workingStr[2] = Number(workingStr[2]);
    
        workingDict['size'] = workingStr[0];
        workingDict['letter'] = workingStr[1];
        workingDict['price'] = workingStr[2];
    
        shoppingCartItems.push(workingDict);

        subtotal += shoppingCartItems[i]['price'];
    }
    taxed = Number((subtotal * taxRate));
    total = (subtotal + taxed);
    populateCartTable();
}

// grabs the selected size and finds its price
function sizeSelection(selectedSize){
    let price = 0;
    let productSize = "";    

    for (let i = 0; i < sizePrices.length; i++){
        if (sizePrices[i]['letter'] == selectedSize){
            price = sizePrices[i]['price'];
            productSize = sizePrices[i]['letter'];

            let storageStr = [sizePrices[i]['size'], sizePrices[i]['letter'], 
            sizePrices[i]['price']].join(",");

            localStorage.setItem("cartItem" + localStorage.length, storageStr);
            updateCartArr();
        }
        
    }
    addItemToCart(price, productSize);    
    populateCartTable();
}

// adds the price of the product to the cart total
function addItemToCart(price, productSize){
    let modalMessage = document.getElementById("modalContent");
    modalMessage.innerHTML = 
        `
        ${productSize} Shirt Added (Costs $${price}) - Total $${total.toFixed(2)}
        `
}

// HTML FORMATTING
// creates the table and dropdown menu based from dictionary
function addSelectOptions(){
    // sizes and availability table
    const sizes = document.getElementById("sizes-table");
    sizes.innerHTML = 
        `
        <tr>
            <th>Size</th>
            <th>Availability</th>
        </tr>
        `
    for (let i = 0; i < sizePrices.length; i++){
        sizes.innerHTML += 
            `
            <tr>
                <td>${sizePrices[i]["letter"]}</td>
                <td>${sizePrices[i]["availability"]}</td>
            <tr>
            `
    }
    // select box
    const selects = document.getElementById("selects");
    selects.innerHTML = "";
    for (let i = 0; i < sizePrices.length; i++){
        selects.innerHTML +=
            `
            <option value="${sizePrices[i]['letter']}">${sizePrices[i]['letter']}</option>
            `
    }
}

// updates the h2 for the item price upon select change
function updatePriceText(){
    let chosenSize = document.getElementById("selects").value;
    let price = 0;
    for (let i = 0; i < sizePrices.length; i++){
        if (sizePrices[i]["letter"] == chosenSize){
            price = sizePrices[i]["price"];
        }
    }
    document.getElementById("price-txt").innerHTML = "$" + price;
}

// show and hide cart popup table
const cartImage = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");

cartImage.addEventListener('mouseover', () => {
    cartPopup.style.display = 'block';
});

cartImage.addEventListener('mouseout', () => {
    cartPopup.style.display = 'none';
});

// populate table with localStorage data
function populateCartTable(){
    let cartPopupTable = document.getElementById("cart-popup-table");

    // if there are no items in the cart, show "No items in cart", else populate
    if (shoppingCartItems.length == 0){
            cartPopupTable.innerHTML = 
            `
            <tr>
                <td style="border: none; font-weight: bold;">No items in cart</td>
            </tr>
            `
    } else {
        cartPopupTable.innerHTML = 
            `
            <tr>
                <th>Item</th>
                <th>Price</th>
            </tr>
            `
            
        for (let i = 0; i < shoppingCartItems.length; i++){
            cartPopupTable.innerHTML +=
                `
                <tr>
                    <td>${shoppingCartItems[i]['letter']}</td>
                    <td>$${shoppingCartItems[i]['price']}</td>
                </tr>
                `
        }        
        cartPopupTable.innerHTML +=
        `
        <tr>
            <td class="total-section">Subtotal:</td>
            <td class="total-section" style="text-align: left">
                $${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td class="total-section">Tax:</td>
            <td class="total-section" style="text-align: left">
                $${taxed.toFixed(2)}</td>
        </tr>
        <tr>
            <td class="total-section">Total:</td>
            <td class="total-section" style="text-align: left">
                $${total.toFixed(2)}</td>
        </tr>
        `
    };

}

// MODAL CODE
const modal = document.getElementById("modal");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const modalCloseBtn = document.getElementsByClassName("closeBtn")[0];

addToCartBtn.onclick = function() {
    sizeSelection(document.getElementById('selects').value);
    modal.style.display = "block";
  
}

modalCloseBtn.onclick = function() {
  modal.style.display = "none";
}

// clicking anywhere on the screen also closes it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}