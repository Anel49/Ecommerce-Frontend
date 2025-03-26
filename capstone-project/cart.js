
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];

$(document).ready(function(){

    updateCartArr();
    updateCartTable();

    // zeros out shoppingCartItems to repopulate with new localStorage variables
    function updateCartArr(){
        subtotal = 0;
        shoppingCartItems = [];
        const localStorageArr = Object.keys(localStorage);

        $.each(localStorageArr, function(i){
            let workingDict = {};
            let workingStr = "";
            // let unmatched = false; //in case I codense them into one

            try {
                const str = localStorage.getItem("cartItem" + i);

                workingStr = str.split(",");
                workingStr[2] = Number(workingStr[2]);

                workingDict['id'] = workingStr[0];
                workingDict['size'] = workingStr[1]
                workingDict['price'] = workingStr[2];
                workingDict['name'] = workingStr[3];
                workingDict['pic'] = workingStr[4];
                workingDict['category'] = workingStr[5];

            } catch (e){
                return e;
            }
            shoppingCartItems.push(workingDict);
        });

        $.each(shoppingCartItems, function(i){
            subtotal += shoppingCartItems[i]['price'];
        });

        taxed = (subtotal * taxRate);
        total = Number((subtotal + taxed).toFixed(2));
        return total;
    }

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
        const localStorageKeys = Object.keys(localStorage);

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
            // TODO bottom padding is unnaturally long
            checkoutBtn.css("background-color", "white");
            checkoutBtn.html("");

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
                //const total = key.count * key.price;
                popupTable.append(`
                    <tr id="${key.category},${key.id},${key.name},${key.pic},${key.price}">
                        <td><img src="${key.pic}"
                             alt="${key.size}, ${key.name}"></td>
                        <td>${key.size}, ${key.name}</td>
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
                    <button id="checkout-btn" type="button">
                        Checkout
                    </button>
            `);
        };
    };

    $("#checkout-btn").click(function(){
        window.location = "checkout.html";
    });
});