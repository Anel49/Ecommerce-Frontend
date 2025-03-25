
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];

$(document).ready(function(){

    updateCartArray();

    $("#page-header").html(`
        <h1>Checkout Cart</h1>
        `)
    
    $("#order-total").attr("placeholder", "$" + total.toFixed(2));

    function updateCartArray(){
        subtotal = 0;
        shoppingCartItems = [];
        const localStorageArr = Object.keys(localStorage);

        $.each(localStorageArr, function(i){
            let workingDict = {};
            let workingStr = "";
            // let unmatched = false; //in case I codense them into one

            try {
                const str = localStorage.getItem("cartItem" + i);
                console.log(str);

                workingStr = str.split(",");
                workingStr[1] = Number(workingStr[1]);

                workingDict['id'] = workingStr[0];
                workingDict['price'] = workingStr[1];
                workingDict['name'] = workingStr[2];
                workingDict['pic'] = workingStr[3];
                workingDict['category'] = workingStr[4];

            } catch (e){
                return e;
            }
            shoppingCartItems.push(workingDict);
            console.log(shoppingCartItems);
        });

        $.each(shoppingCartItems, function(i){
            subtotal += shoppingCartItems[i]['price'];
        });

        taxed = (subtotal * taxRate);
        total = (subtotal + taxed);
        return total;
    }

    $(document).on('click', "#submit-btn", function(){
        const customerId = Math.floor(Math.random() * (2327 - 875 + 1)) + 875;
        const orderDate = new Date().toISOString();
        const totalAmount = $("#order-total").val();
        const paymentMethod = $('input:radio[name="payment-method"]:checked').val();
        const shippingAddress = $("#shipping-address").val();

        if (shippingAddress.replace(/ /g, "") !== ""){
            if (($.isNumeric(Number(totalAmount))) && (totalAmount !== "")){
                if (paymentMethod !== undefined){

                    const orderDetails =
                        {"customer_id": customerId,
                        "order_date": orderDate,
                        "total_amount": totalAmount,
                        "payment_method": paymentMethod,
                        "shipping_address": shippingAddress};
                    
                    console.log(orderDetails);

                    // uncomment once everything has been laid out
                    // fetch("http://3.136.18.203:8000/orders/", {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //       },
                    //     body: JSON.stringify(orderDetails)
                    // })
                    // .then(response => {
                    //     if (!response.ok) {
                    //       throw new Error(`HTTP error! status: ${response.status}`);
                    //     }
                    //     return response.json();
                    //   })
                    //   .then(responseData => {
                    //     console.log('Success:', responseData);
                    //   })
                    //   .catch(error => {
                    //     console.error('Error:', error);
                    //   });
                } else {
                    alert("A payment method is required to submit an order.");
                }                               
            } else {
                alert("A valid total is required to submit an order.")
            }
        } else {
            alert("A shipping address is required to submit an order.")
        }
    });
});