
$(document).ready(function(){
    
    let categoriesArr = [];
    let productsArr = [];
    let productContainer = $(".product-container")[0];
    let cartIcon = $("#cart-icon");
    const template = $("#product-template")[0];
    const productsAPI = "http://3.136.18.203:8000/products/";
    const categoriesAPI = "http://3.136.18.203:8000/categories/";
    const fragment = document.createDocumentFragment();

    fetchProducts();
    updateCartNumber();

    function fetchProducts(){
        let productsRequest = $.get(productsAPI, function(products){
            productsArr = products;
        });
        let categoriesRequest = $.get(categoriesAPI, function(categories){
            categoriesArr = categories;
        });
        $.when(productsRequest, categoriesRequest).done(function(){
            loadProducts();
        });
    }

    function loadProducts(){

        $.each(productsArr, function(i, key){
            let matchingCategoryName = "";
            const myElement = template.content.cloneNode(true);

            $.each(categoriesArr, function(i){
                if ($(this)[0].category_id == key.category){
                    matchingCategoryName = $(this)[0].name;
                }
            });
            myElement.querySelector(".product-card").href += key.product_id;
            myElement.querySelector(".pr-img").src = key.picture_url;
            myElement.querySelector(".pr-name").textContent = key.name;
            myElement.querySelector(".pr-category").textContent = matchingCategoryName;
            myElement.querySelector(".pr-starting-price").textContent += key.starting_at_price;
            myElement.querySelector(".pr-qty").textContent = key.product_id + " in Stock";
            myElement.querySelector(".pr-description").textContent = key.description;
            fragment.appendChild(myElement);            
        });
        productContainer.appendChild(fragment);
    }

    $(document).on('click', ".product-card", function(){
        const productId = $(this).closest("div").attr("id");
        window.location.href = productId;
    });

    function updateCartNumber(){
        if (localStorage.length === 0){
            cartIcon.html("0");
        } else if (localStorage.length > 100){
            cartIcon.html("99");
        } else {
            const cartSize = localStorage.length - 1;
            cartIcon.html(`${cartSize}`);
            cartIcon.css("padding-left", "15px");
        }        
    }
});