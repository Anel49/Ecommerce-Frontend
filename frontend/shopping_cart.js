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
                const str = localStorage.getItem("cartItem" + i);
                
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
                        const {count, ...sciString} = shoppingCartItems[j];

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
                const total = key.count * key.price;
                popupTable.append(`
                    <tr id="${key.size},${key.letter},${key.price},${key.color},${key.pic}">
                        <td><img src="${key.pic}"
                             alt="Navy Shirt"></td>
                        <td>${key.letter} ${key.color} Shirt</td>
                        <td>$${key.price}</td>
                        <td>${key.count}</td>
                        <td>$${parseFloat(total.toFixed(2))}</td>
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

    // removes matching entry from localStorage
    $(document).on('click', '.removeBtn', function(){
        const rowName = $(this).closest("tr").attr("id");
        
        $.each(localStorage, function(key, val){
            console.log("rowName:", rowName);
            console.log("localStorage val: ", val);
            if (rowName == val){
                localStorage.removeItem(key);
                cartToLocalStorage();
                updateCartTable();
                return false;
            };
        });
    });
});