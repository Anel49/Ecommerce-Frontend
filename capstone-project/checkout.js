
$(document).ready(function(){

    $("#page-header").html(`
        <h1>Checkout Cart</h1>
        `)

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
                        console.log('Success:', responseData);
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
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