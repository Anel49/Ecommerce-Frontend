
const productArr = [
    {
        img: "default-img.jpg",
        name: "Product 1",
        category: "Category",
        price: 9.99,
        stock: 8,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                   facilisis hendrerit mauris volutpat mollis. Cras vestibulum 
                   lectus orci, a ullamcorper sem fermentum eget. Curabitur 
                   posuere aliquet tortor sit amet pharetra. Integer viverra id 
                   dolor sit amet fringilla.`
    }, 
    {
        img: "default-img.jpg",
        name: "Product 2",
        category: "Category",
        price: 9.99,
        stock: 8,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                   facilisis hendrerit mauris volutpat mollis. Cras vestibulum 
                   lectus orci, a ullamcorper sem fermentum eget. Curabitur 
                   posuere aliquet tortor sit amet pharetra. Integer viverra id 
                   dolor sit amet fringilla.`
    }, 
    {
        img: "default-img.jpg",
        name: "Product 3",
        category: "Category",
        price: 9.99,
        stock: 8,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                   facilisis hendrerit mauris volutpat mollis. Cras vestibulum 
                   lectus orci, a ullamcorper sem fermentum eget. Curabitur 
                   posuere aliquet tortor sit amet pharetra. Integer viverra id 
                   dolor sit amet fringilla.`
    }, 
    {
        img: "default-img.jpg",
        name: "Product 4",
        category: "Category",
        price: 9.99,
        stock: 8,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                   facilisis hendrerit mauris volutpat mollis. Cras vestibulum 
                   lectus orci, a ullamcorper sem fermentum eget. Curabitur 
                   posuere aliquet tortor sit amet pharetra. Integer viverra id 
                   dolor sit amet fringilla.`
    }, 
    {
        img: "default-img.jpg",
        name: "Product 5",
        category: "Category",
        price: 9.99,
        stock: 8,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                   facilisis hendrerit mauris volutpat mollis. Cras vestibulum 
                   lectus orci, a ullamcorper sem fermentum eget. Curabitur 
                   posuere aliquet tortor sit amet pharetra. Integer viverra id 
                   dolor sit amet fringilla.`
    }
]

$(document).ready(function(){

    loadProducts();

    function loadProducts(){
        let productContainer = $(".product-container");
        $.each(productArr, function(i, key){
            productContainer.append(`
                <div>
                    <img src="${key.img}">
                    <h3>${key.name}</h3>
                    <p>${key.category}</p>
                    <h4>$${key.price}</h4>
                    <p>${key.stock} in Stock</p>
                    <p>${key.description}</p>
                </div>
                `);
        });
    }
});