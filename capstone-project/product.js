
$(document).ready(function(){

    const url = window.location.href;
    const searchParams = new URL(url).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const product = Array.from(entries);

    let categoriesArr = [];
    let productsArr = [];
    let pageHeader = $("#page-header");
    let productContainer = $(".product-container");
    let itemArr = [];
    let dropdown = $("#dropdown");
    let productPrice = $("#productPrice");

    function fetchProducts(){
        $.get("http://3.136.18.203:8000/products/", function(products){
            productsArr = products;
        });
        $.get("http://3.136.18.203:8000/categories/", function(categories){
            categoriesArr = categories;
            // ask why allProductsPage() can't be called after both of these gets 
            // run
            findProduct();
        });
    }
    
    fetchProducts();
    
    function findProduct(){
        
        $.each(productsArr, function(i, key){
            // finding matching product using product_id
            if ($(this)[0].product_id == product[0][1]){
                itemArr = $(this)[0];

                $(document).attr('title', itemArr.name);
                pageHeader.html(`
                    <h1>${itemArr.name}</h1>
                    `)
                loadProduct();
                return false;

            // not found, set default text
            } else {
                $(document).attr('title', "Pet Warehouse");
                pageHeader.html(`
                    <h1>Product not found</h1>    
                    `);
            }

            // finding category name
            $.each(categoriesArr, function(i){
                if ($(this)[0].category_id == key.category){
                    matchingCategory = $(this)[0].name;
                }
            });
        });
    }

    function loadProduct(){
        productContainer.append(`
            <div id="${itemArr.product_id}" class="product-card">
                <img src="${itemArr.picture_url}">
                <h3>${itemArr.name}</h3>
                <p>${matchingCategory}</p>
                <h4 id="productPrice">$${itemArr.starting_at_price}</h4>
                <p>${itemArr.stock_quantity} in Stock</p>
                <p>${itemArr.description}</p>
                <select id="dropdown" class="field"></select>
                <form>
                    <button id="add-to-cart-btn" type="button" class="field">
                        Add to Cart
                    </button>
                </form>
            </div>
            `);
        
        // loads product item varieties into the select dropdown
        // won't select element using "dropdown" variable name :(((
        $.each(itemArr.varieties, function(i, key){
            $("#dropdown").append(`
                <option value="${key.name}">${key.name}</option>
                `);
        });
    }

    // TODO won't select elements using variable names :(((
    $(document).on('change', '#dropdown', function(){
        $.each(itemArr.varieties, function(i, key){
            if ($("#dropdown").val() == key.name){
                $("#productPrice").html(`$${key.price}`);
            }
        });
    });
});