// variables for cart totals and shopping cart
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];
// color dictionary array for when I implement colors
let shirtColors = [
    {color: "Black", path: "./imgs/products/black-shirtfront.png"},
    {color: "Blue", path: "./imgs/products/blue-shirtfront.png"},
    {color: "Gray", path: "./imgs/products/gray-shirtfront.png"},
    {color: "Maroon", path: "./imgs/products/maroon-shirtfront.png"},
    {color: "Navy", path: "./imgs/products/navy-shirtfront.png"},
    {color: "Red", path: "./imgs/products/red-shirtfront.png"},
    {color: "Tan", path: "./imgs/products/tan-shirtfront.png"},
    {color: "White", path: "./imgs/products/white-shirtfront.png"}
];

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
    let sizeSelect = $("#sizeSelect");
    let colorSelect = $("#colorSelect");

    $.each(sizePrices, function(i, key){
        // table
        let row = $("<tr>");
        row.append("<td>" + key.letter + "</td>");
        row.append("<td>$" + key.price + "</td>");
        row.append("</tr>");
        table.append(row);
        // size selections
        sizeSelect.append(
            `
            <option value="${key.letter}">${key.letter}</option>
            `);
    });

    $.each(shirtColors, function(i, key){
        colorSelect.append(`
            <option value="${key.color}">${key.color}</option>
            `);
    })

    // changes
    // when the user selects a different size, the h2 price changes
    sizeSelect.change(function(){
        $.each(sizePrices, function(i, key){
            if (sizeSelect.val() == key.letter){
                $("#price-txt").text("$" + key.price);
            }
        })
    });

    //when the user selects a different color, the image changes
    colorSelect.change(function(){
        $.each(shirtColors, function(i, key){
            if (colorSelect.val() == key.color){
                $("#shirt-img").attr("src", key.path);
            }
        })
    })

    // when the user adds an item to the cart
    addToCartBtn.click(function(){
        $.each(sizePrices, function(i, key){
            if (sizeSelect.val() == key.letter){
                let storageStr = [key.size, key.letter, key.price].join(",");
                localStorage.setItem("cartItem" + getNextCartItemId(), storageStr);
                // TODO update the user's cart with this new localStorage addition
                updateCartArr();
                updateModalMessage(key.letter, key.price);                
            };
        });
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
    const cartPopup = $("#cart-popup");
    const cart = $("#cart");
    cart.hover(function(){
        cartPopup.addClass('show');
    },
    function(){
        cartPopup.removeClass('show');
    });
    
    cart.click(function(){
        window.location.href='shopping_cart.html';
    });

    // modal
    modalCloseBtn.click(function(){
        modal.removeClass('show');
    });

    addToCartBtn.click(function(){
        modal.addClass('show');
    });

    function updateModalMessage(letter, price){
        modalMessage.text(`
            ${letter} Shirt Added (Costs $${price}) - Total $${total.toFixed(2)}
            `)
    };
});