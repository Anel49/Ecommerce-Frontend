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
    console.log(shoppingCartItems);

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

    // updates the cart table
    function updateCartTable(){
        let popupTable = $("#main-content");

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
                    <tr>
                        <td><img src="${key.pic}"
                             alt="Navy Shirt"></td>
                        <td>${key.letter} ${key.color} Shirt</td>
                        <td>$${key.price}</td>
                        <td>1</td>
                        <td>$${key.price}</td>
                        <td><input type="submit" value="Remove"></td>
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
        };
    };
});