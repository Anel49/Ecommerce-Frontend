
$(document).ready(function(){

    
    let categoriesArr = [];
    let productsArr = [];
    let productContainer = $(".product-container");

    fetchProducts();

    function fetchProducts(){
        $.get("http://3.136.18.203:8000/products/", function(products){
            productsArr = products;
        });
        $.get("http://3.136.18.203:8000/categories/", function(categories){
            categoriesArr = categories;
            // ask why loadProducts() can't be called after both of these gets 
            // run
            loadProducts();
        });
    }
    
    function loadProducts(){
        let matchingCategoryName = "";
        
        $("#page-header").html(`
            <h1>All Products</h1>
            `);

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
});