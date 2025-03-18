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

$(document).ready(function(){

    updateCartArr();
    updateCartTable();

    // empties shoppingCartItems to repopulate with new localStorage variables
    function updateCartArr(){
        subtotal = 0;
        shoppingCartItems = [];
        let localStorageKeys = Object.keys(localStorage);

        $.each(localStorageKeys, function(i){
            let workingDict = {};
            let workingStr = "";

            try {
                let str = localStorage.getItem("cartItem" + i);
                workingStr = str.split(",");
                workingStr[2] = Number(workingStr[2]);

                workingDict['size'] = workingStr[0];
                workingDict['letter'] = workingStr[1];
                workingDict['price'] = workingStr[2];
                workingDict['color'] = workingStr[3];
                workingDict['pic'] = workingStr[4];

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

    // empties shoppingCartItems to repopulate with new localStorage variables
    function cartToLocalStorage(){
        let newCartArr = [];
        let localStorageKeys = Object.keys(localStorage);

        $.each(localStorageKeys, function(i){
            try {
                let str = localStorage.getItem("cartItem" + i);
                if (str !== null){
                    newCartArr.push(str);
                }
            } catch (e){
                return e;
            }
        });
        
        localStorage.clear();

        $.each(newCartArr, function(i){
            localStorage.setItem("cartItem" + getNextCartItemId(), newCartArr[i]);
        });

        updateCartArr();
        taxed = (subtotal * taxRate);
        total = (subtotal + taxed);
        updateCartTable();
    };

    // updates the cart table
    function updateCartTable(){
        let popupTable = $("#main-content");
        let checkoutBtn = $("#checkout-btn");

        if (shoppingCartItems.length == 0){
            popupTable.html(`
                <tr>
                    <td style="border: none; font-weight: bold;">
                        No items in cart
                    </td>
                </tr>
                `);
            checkoutBtn.html(``);

        } else {
            // headers
            popupTable.html(`
                <tr>
                    <th>Picture</th>
                    <th>Product Title</th>
                    <th>Product Cost</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                    <th>Remove</th>
                </tr>
                `
            );

            // shopping cart items
            $.each(shoppingCartItems, function(i, key){
                popupTable.append(`
                    <tr id="cartItem${i}">
                        <td><img src="${key.pic}"
                             alt="Navy Shirt"></td>
                        <td>${key.letter} ${key.color} Shirt</td>
                        <td>$${key.price}</td>
                        <td>1</td>
                        <td>$${key.price}</td>
                        <td><input type="submit" value="Remove" 
                            class="removeBtn"></td>
                    </tr>
                    `);
            });
            
            // subtotal, tax, and total section
            popupTable.append(`
                <tr class="total-section">
                    <td></td><td></td><td></td><td></td>
                    <td>Subtotal:</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
                <tr class="total-section">
                    <td></td><td></td><td></td><td></td>
                    <td>Tax:</td>
                    <td>$${taxed.toFixed(2)}</td>
                </tr>
                <tr class="total-section">
                    <td></td><td></td><td></td><td></td>
                    <td>Total:</td>
                    <td>$${total.toFixed(2)}</td>
                </tr>
            `);

            checkoutBtn.html(`
                <input type="submit" value="Checkout">
                `);
        };
    };

    // removes matching entry from shoppingCartItems
    $(document).on('click', '.removeBtn', function(){
        let rowName = $(this).closest("tr").attr("id");
        $.each(localStorage, function(key, val){
            if (rowName == key){
                localStorage.removeItem(key);
                cartToLocalStorage();
                updateCartTable();
            };
        });
    });
});