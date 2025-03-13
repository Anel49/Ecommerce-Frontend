// variables for cart totals and shopping cart
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];

// array of dictionary objects with full size names, size letters, and prices
let sizePrices = [
    {size: "Extra Small", letter: "XS", price: 19.99, availability: "In Stock"},
    {size: "Small", letter: "S", price: 21.99, availability: "In Stock"},
    {size: "Medium", letter: "M", price: 23.99, availability: "In Stock"},
    {size: "Large", letter: "L", price: 25.99, availability: "Out of Stock"},
    {size: "Extra Large", letter: "XL", price: 27.99, availability: "Out of Stock"},
    {size: "Extra Extra Large", letter: "XXL", price: 29.99, availability: "In Stock"}
];

$(document).ready(function(){

    // constants
    const addToCartBtn = $("#add-to-cart-btn");
    const modal = $("#modal");    
    const modalCloseBtn = $("span");
    const modalMessage = $("#modalMsg");

    // calling for default populating table, dropdown, and localStorage shopping 
    // cart
    updateCartTable();
    updateCartArr();

    // creates or changes "cartItemCount"'s value and assigns num for next index
    function getNextCartItemId(){
        let counter = localStorage.getItem("lastIndex");
        if (counter === null){
            counter = 0;
        } else {
            counter = parseInt(counter) + 1;
        }
        localStorage.setItem("lastIndex", counter);
        return counter;
    }

    // populating table and select sizes
    let table = $("#sizes-table");
    let selects = $("#selects");

    $.each(sizePrices, function(i, key){
        // table
        let row = $("<tr>");
        row.append("<td>" + key.letter + "</td>");
        row.append("<td>$" + key.price + "</td>");
        row.append("</tr>");
        table.append(row);
        // size selections
        selects.append(
            `
            <option value="${key.letter}">${key.letter}</option>
            `);
    });

    // when the user selects a different size, the h2 price changes
    selects.change(function(){
        $.each(sizePrices, function(i, key){
            if (selects.val() == key.letter){
                $("#price-txt").text("$" + key.price);
            }
        })
    });

    // when the user adds an item to the cart
    addToCartBtn.click(function(){
        $.each(sizePrices, function(i, key){
            if (selects.val() == key.letter){
                let storageStr = [key.size, key.letter, key.price].join(",");
                localStorage.setItem("cartItem" + getNextCartItemId(), storageStr);
                // TODO update the user's cart with this new localStorage addition
                updateCartArr();
                updateModalMessage(key.letter, key.price);                
            };
        });
        modal.css("display", "block");
    });

    // zeros out shoppingCartItems to repopulate with new localStorage variables
    function updateCartArr(){
        subtotal = 0;
        shoppingCartItems = [];
        let localStorageArr = Object.keys(localStorage);

        $.each(localStorageArr, function(i){
            let workingDict = {};
            let workingStr = "";

            try {
                let str = localStorage.getItem("cartItem" + i);
                workingStr = str.split(",");
                workingStr[2] = Number(workingStr[2]);

                workingDict['size'] = workingStr[0];
                workingDict['letter'] = workingStr[1];
                workingDict['price'] = workingStr[2];

                shoppingCartItems.push(workingDict);
                subtotal += shoppingCartItems[i]['price'];
            } catch (e){
                return e;
            }            
        });
        taxed = (subtotal * taxRate);
        total = (subtotal + taxed);
        updateCartTable();
    };

    // updates the popup cart table
    function updateCartTable(){
        let popupTable = $("#cart-popup-table");

        if (shoppingCartItems.length == 0){
            popupTable.html(`
                <tr>
                    <td style="border: none; font-weight: bold;">
                        No items in cart
                    </td>
                </tr>
                `);
        } else {
            // headers
            popupTable.html(`
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                <tr>
                `
            );

            // shopping cart items
            $.each(shoppingCartItems, function(i, key){
                popupTable.append(`
                    <tr>
                        <td>${key.letter}</td>
                        <td>$${key.price}</td>
                    </tr>
                    `);
            });
            // subtotal, tax, and total section
            popupTable.append(`
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
            `);
        };
    };

    // popups
    // can't figure out a way to not use explicit CSS to show/hide
    // cart
    const cartPopup = $("#cart-popup");
    $("#cart").hover(function(){
        cartPopup.css("display",  "block");
    },
    function(){
        cartPopup.css("display", "none");
    });    
    // modal
    addToCartBtn.click(function(){
        modal.css("display", "block");
    });

    modalCloseBtn.click(function(){
        modal.css("display", "none");
    });

    function updateModalMessage(letter, price){
        modalMessage.text(`
            ${letter} Shirt Added (Costs $${price}) - Total $${total.toFixed(2)}
            `)
    };
});