
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

    loadProduct();
    getCategories()

    function loadProduct(productsArr, categoriesArr){
        let productContainer = $(".product-container");
        let matchingCategory = "";
        
        $.each(productsArr, function(i, key){

            $.each(categoriesArr, function(i){
                if ($(this)[0].category_id === key.category){
                    matchingCategory = $(this)[0].name;
                }
            });

            productContainer.append(`
                <div>
                    <img src="${key.picture_url}">
                    <h3>${key.name}</h3>
                    <p>${matchingCategory}</p>
                    <h4>$${key.starting_at_price}</h4>
                    <p>${key.stock_quantity} in Stock</p>
                    <p>${key.description}</p>
                    </div>
                `);
        });
    }   

    function getCategories(){
        let productsArr = [];
        let categoriesArr = [];

        $.get("http://3.136.18.203:8000/products/", function(products){
            productsArr = products; 
            $.get("http://3.136.18.203:8000/categories/", function(categories){
                categoriesArr = categories;
                loadProduct(productsArr, categoriesArr);
            });           
        });
    }


















});