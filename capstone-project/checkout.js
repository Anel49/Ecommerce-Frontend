
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];
let cartIcon = $("#cart-icon");

$(document).ready(function(){

    updateCartArray();
    updateCartNumber();
    

    $("#order-total").attr("placeholder", "$" + total.toFixed(2));
    
    function updateCartArray(){
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
        return total;
    }

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
                    
                    console.log(orderDetails);

                    // fetch("http://3.136.18.203:8000/orders/", {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify(orderDetails)
                    // })
                    // .then(response => {
                    //     if (!response.ok) {
                    //       throw new Error(`HTTP error! status: ${response.status}`);
                    //     }
                    //     return response.json();
                    // })
                    // .then(responseData => {
                    //     alert("Order successfully submitted!");
                    //     localStorage.clear();
                    //     console.log('Success:', responseData);
                    // })
                    // .catch(error => {
                    //     console.error('Error:', error);
                    // });

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

    function updateCartNumber(){
        if (localStorage.length === 0){
            cartIcon.html("0");
        } else if (localStorage.length > 100){
            cartIcon.html("99");
        } else {
            const cartSize = localStorage.length - 1;
            cartIcon.html(`${cartSize}`);
        }
    }
});