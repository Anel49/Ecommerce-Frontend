
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];

$(document).ready(function(){

    updateCartArr();
    updateCartTable();
    $("#order-total").attr("placeholder", "$" + total.toFixed(2));

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
                workingStr[1] = Number(workingStr[1]);

                workingDict['size'] = workingStr[0]
                workingDict['price'] = workingStr[1];
                workingDict['name'] = workingStr[2];
                workingDict['pic'] = workingStr[3];

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
        total = Number((subtotal + taxed).toFixed(2));

        updateCartTable();

        return total;
    }

    // updates the cart table
    function updateCartTable(){
        let popupTable = $("#main-content");
        let cartCheckoutSection = $("#checkout-btn-section")

        if (shoppingCartItems.length === 0){
            popupTable.html(`
                <tr>
                    <td style="border: none; font-weight: bold;">
                        No items in cart
                    </td>
                </tr>
            `);
            cartCheckoutSection.html(``);
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
            `);

            // shopping cart items
            $.each(shoppingCartItems, function(i, key){
                const total = key.count * key.price; 
                popupTable.append(`
                    <tr id="${key.size},${key.price},${key.name},${key.pic}">
                        <td><img src="${key.pic}"
                             alt="${key.size}, ${key.name}"></td>
                        <td>${key.name}, ${key.size}</td>
                        <td>$${key.price}</td>
                        <td>${key.count}</td>
                        <td>$${total.toFixed(2)}</td>
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
            
            cartCheckoutSection.html(`
                <a>
                    <button id="checkout-btn" type="button" class="">
                        Checkout
                    </button>
                </a>
            `);
        }
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

    $("#checkout-btn").click(function(){
        $("#modal").css("display", "block");
    });

    // removes matching entry from localStorage
    $(document).on('click', '.removeBtn', function(){
        const rowName = $(this).closest("tr").attr("id");
        
        $.each(localStorage, function(key, val){
            if (rowName == val){
                localStorage.removeItem(key);
                cartToLocalStorage();
                updateCartTable();
                return false;
            };
        });
    });

    // modal
    $(document).on('click', ".closeBtn", function(){
        $("#modal").css('display', "none");
    });

    $(document).on('click', "#submit-btn", function(){
        const customerId = Math.floor(Math.random() * (2327 - 875 + 1)) + 875;
        const orderDate = new Date().toISOString();
        const paymentMethod = $('input:radio[name="payment-method"]:checked').val();
        const shippingAddress = $("#shipping-address").val();

        if (shippingAddress.replace(/ /g, "") !== ""){
            if (total !== ""){
                if (paymentMethod !== undefined){

                    const orderDetails =
                        {"customer_id": customerId,
                        "order_date": orderDate,
                        "total_amount": total,
                        "payment_method": paymentMethod,
                        "shipping_address": shippingAddress};

                    fetch("http://3.136.18.203:8000/orders/", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orderDetails)
                    })
                    .then(response => {
                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(responseData => {
                        alert("Order successfully submitted!");
                        localStorage.clear();
                        updateCartArr();
                        $('form')[0].reset();
                        $("#order-total").attr("placeholder", "$" + total.toFixed(2));                        
                        console.log('Success:', responseData);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                } else {
                    alert("A payment method is required to submit an order.");
                }                               
            } else {
                alert("A total is required to submit an order.")
            }
        } else {
            alert("A shipping address is required to submit an order.")
        }
    });
});