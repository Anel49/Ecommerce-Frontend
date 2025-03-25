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
const shirtSizes = [
    {size: "Extra Small", letter: "XS", price: 19.99},
    {size: "Small", letter: "S", price: 21.99},
    {size: "Medium", letter: "M", price: 23.99},
    {size: "Large", letter: "L", price: 25.99},
    {size: "Extra Large", letter: "XL", price: 27.99},
    {size: "Extra Extra Large", letter: "XXL", price: 29.99}
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

    // table and select element vars
    let table = $("#sizes-table");
    let sizeSelect = $("#sizeSelect");
    let colorSelect = $("#colorSelect");

    // populates table
    $.each(shirtSizes, function(i, key){
        // table
        let row = $("<tr>");
        row.append("<td>" + key.letter + "</td>");
        row.append("<td>$" + key.price + "</td>");
        row.append("</tr>");
        table.append(row);

        // populates select sizes
        sizeSelect.append(
            `
            <option value="${key.letter}">${key.letter}</option>
            `);
    });

    // populates select colors
    $.each(shirtColors, function(i, key){
        colorSelect.append(`
            <option value="${key.color}">${key.color}</option>
            `);
    })

    // visual element changes
    // when the user selects a different size, the h2 price changes
    sizeSelect.change(function(){
        $.each(shirtSizes, function(i, key){
            if (sizeSelect.val() == key.letter){
                $("#price-txt").text("$" + key.price);
            }
        })
    });

    // when the user selects a different color, the image changes
    colorSelect.change(function(){
        $.each(shirtColors, function(i, key){
            if (colorSelect.val() == key.color){
                $("#shirt-img").attr("src", key.path);
            }
        })
    })

    // when the user adds an item to the cart
    addToCartBtn.click(function(){
        let sizeStr = "";
        let colorStr = "";
        let modalMsg = [];
        $.each(shirtSizes, function(i, key){
            if (sizeSelect.val() == key.letter){
                sizeStr = [key.size, key.letter, key.price].join(",");
                modalMsg.push(key.size, key.price);
            };
        });
        $.each(shirtColors, function(i, key){
            if (colorSelect.val() == key.color){
                colorStr = [key.color, key.path].join(",");
                modalMsg.push(key.color);
            }
        });

        let concatStr = sizeStr + "," + colorStr;

        localStorage.setItem("cartItem" + getNextCartItemId(), concatStr);
        updateCartArr();
        updateModalMessage(modalMsg);
    });

    // zeros out shoppingCartItems to repopulate with new localStorage variables
    function updateCartArr(){
        subtotal = 0;
        shoppingCartItems = [];
        const localStorageArr = Object.keys(localStorage);

        $.each(localStorageArr, function(i){
            let workingDict = {};
            let workingStr = "";
            let unmatched = false;

            try {
                let str = localStorage.getItem("cartItem" + i);
                
                workingStr = str.split(",");
                workingStr[2] = Number(workingStr[2]);

                workingDict['size'] = workingStr[0];
                workingDict['letter'] = workingStr[1];
                workingDict['price'] = workingStr[2];
                workingDict['color'] = workingStr[3];
                workingDict['pic'] = workingStr[4];

                if (shoppingCartItems.length == 0){
                    workingDict['count'] = 1;
                    shoppingCartItems.push(workingDict);
                } else {

                    // taking count of items
                    $.each(shoppingCartItems, function(j){
                        unmatched = false;
                        let {count, ...sciString} = shoppingCartItems[j];

                        if (JSON.stringify(workingDict) == JSON.stringify(sciString)){
                            shoppingCartItems[j]['count'] += 1;
                            return false;
                        } else {
                            unmatched = true;
                        }
                    });

                    if (unmatched){
                        workingDict['count'] = 1;
                        shoppingCartItems.push(workingDict);
                    }
                };

            } catch (e){
                return e;
            }
        });

        $.each(shoppingCartItems, function(i){
            subtotal += (shoppingCartItems[i]['count'] * shoppingCartItems[i]['price']);
        });

        taxed = (subtotal * taxRate);
        total = (subtotal + taxed);

        // keeps the number centered
        let cartCounterText = $("#cart-counter");

        if ((localStorageArr.length < (11))){
            cartCounterText.css("padding-right", "33px");
        } else {
            cartCounterText.css("padding-right", "29px");
        }

        if (localStorageArr.length == 0){            
            cartCounterText.html("0");
        } else if (localStorageArr.length > 100){
            cartCounterText.html("99")
        } else {
            cartCounterText.html(localStorageArr.length - 1);
        }
        
        updateCartTable();
    };

    // updates the popup cart table
    function updateCartTable(){
        let popupTable = $("#cart-popup-table");

        if (shoppingCartItems.length == 0){
            popupTable.html(`
                <tr>
                    <td style="border: none; font-weight: bold; text-align: center">
                        No items in cart
                    </td>
                </tr>
                `);
        } else {
            // headers
            popupTable.html(`
                <tr>
                    <th>Item</th>
                    <th>Item Price</th>
                    <th>Quantity</th>
                    <th>Price</th>
                <tr>
                `
            );

            // shopping cart items
            $.each(shoppingCartItems, function(i, key){
                rowTotal = key.count * key.price;
                popupTable.append(`
                    <tr>
                        <td>${key.letter} ${key.color} Shirt</td>
                        <td>$${key.price}</td>
                        <td style="text-align: center">${key.count}</td>
                        <td>$${rowTotal.toFixed(2)}</td>
                    </tr>
                    `);
            });
            // subtotal, tax, and total section
            popupTable.append(`
                <tr>
                    <td class="total-section"></td>
                    <td class="total-section"></td>
                    <td class="total-section">Subtotal:</td>
                    <td class="total-section" style="text-align: left">
                        $${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="total-section"></td>
                    <td class="total-section"></td>
                    <td class="total-section">Tax:</td>
                    <td class="total-section" style="text-align: left">
                        $${taxed.toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="total-section"></td>
                    <td class="total-section"></td>
                    <td class="total-section">Total:</td>
                    <td class="total-section end" style="text-align: left">
                        $${total.toFixed(2)}</td>
                </tr>
            `);
        };
    };

    // popups
    const cartPopup = $("#cart-popup");
    const cart = $("#cart-counter");
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

    function updateModalMessage(modalMsg){
        modalMessage.text(`
            ${modalMsg[0]} ${modalMsg[2]} Shirt Added (Costs $${modalMsg[1]}) - Total $${total.toFixed(2)}
            `)
    };
});