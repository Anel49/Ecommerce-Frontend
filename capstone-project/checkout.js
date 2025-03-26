
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [];

$(document).ready(function(){

    updateCartArray();

    $("#page-header").html(`
        <h1>Checkout</h1>
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
                alert("A total is required to submit an order.")
            }
        } else {
            alert("A shipping address is required to submit an order.")
        }
    });
});