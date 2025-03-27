
$(document).ready(function(){
    
    let categoriesArr = [];
    let productsArr = [];
    let productContainer = $(".product-container");
    let cartIcon = $("#cart-icon");

    fetchProducts();
    updateCartNumber();

    function fetchProducts(){
        let productsRequest = $.get("http://3.136.18.203:8000/products/", function(products){
            productsArr = products;
        });
        let categoriesRequest = $.get("http://3.136.18.203:8000/categories/", function(categories){
            categoriesArr = categories;
        });
        $.when(productsRequest, categoriesRequest).done(function(){
            loadProducts();
        });
    }

    function loadProducts(){
        let matchingCategoryName = "";

        $.each(productsArr, function(i, key){           

            $.each(categoriesArr, function(i){
                if ($(this)[0].category_id == key.category){
                    matchingCategoryName = $(this)[0].name;
                }
            });

            productContainer.append(`
                <div id="${key.product_id}" class="product-card">
                    <img src="${key.picture_url}">
                    <h3>${key.name}</h3>
                    <p>${matchingCategoryName}</p>
                    <h4 id="price-text">$${key.starting_at_price}</h4>
                    <p>${key.stock_quantity} in Stock</p>
                    <p>${key.description}</p>
                </div>
            `);
        });
    }

    $(document).on('click', ".product-card", function(){
        const url = "product.html?"
        const productId = $(this).closest("div").attr("id");
        window.location.href = url + "product_id=" + productId;
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