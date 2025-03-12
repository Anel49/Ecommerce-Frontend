// variables for cart totals
let subtotal = 0, taxed = 0, total = 0;
const taxRate = 0.06;
let shoppingCartItems = [
    {
        size: "Extra Small",
        letter: "XS",
        price: 19.99,
        availability: "In Stock"
    },
    {
        size: "Small",
        letter: "S",
        price: 21.99,
        availability: "In Stock"
    }
];
// array of dictionary objects with full size names, size letters, and prices
let sizePrices = [
    {
        size: "Extra Small",
        letter: "XS",
        price: 19.99,
        availability: "In Stock"
    },
    {
        size: "Small",
        letter: "S",
        price: 21.99,
        availability: "In Stock"
    },
    {
        size: "Medium",
        letter: "M",
        price: 23.99,
        availability: "In Stock"
    },
    {
        size: "Large",
        letter: "L",
        price: 25.99,
        availability: "Out of Stock"
    },
    {
        size: "Extra Large",
        letter: "XL",
        price: 27.99,
        availability: "Out of Stock"
    },
    {
        size: "Extra Extra Large",
        letter: "XXL",
        price: 29.99,
        availability: "In Stock"
    }
]

// $(document).ready(function(){
//     let tbody = $("sizes-table tbody");
//     let row = $("<tr>");
//     console.log(shoppingCartItems);
//     $.each(shoppingCartItems, function(i, val){
//         row.append($("<td>").text(val('letter')));
//         console.log(val('letter'));
//         row.append($("<td>").text("$" + val('price')));
//         tbody.append(row);
//     });
// });

$(document).ready(function(){
    $("p").click(function(){
        $(this).hide();
    });
});