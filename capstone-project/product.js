
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
    let dropdown = "";
    let productPrice = "";
    let matchingCategoryName = "";

    // getting API variables
    $.get("http://3.136.18.203:8000/products/", function(products){
        productsArr = products;
    });
    $.get("http://3.136.18.203:8000/categories/", function(categories){
        categoriesArr = categories;
        findProduct();
    });
    
    function findProduct(){        
        $.each(productsArr, function(i, key){
            // finding matching product using product_id
            if (key.product_id == product[0][1]){
                itemArr = key;

                $(document).attr('title', itemArr.name);
                pageHeader.html(`
                    <h1>${itemArr.name}</h1>
                    `)
            }
        });
        // finding matching category name
        $.each(categoriesArr, function(i, key){
            if (itemArr.category == key.category_id){
                matchingCategoryName = key.name;
            }
        });        
        // if itemArr is never assigned, the product doesn't exist
        if (itemArr.length == 0) {
            $(document).attr('title', "Pet Warehouse");
            pageHeader.html(`
                <h1>Product not found</h1>    
                `);
        } else {
            loadProduct();
        }
    }

    function loadProduct(){
        productContainer.append(`
            <div id="${itemArr.product_id}" class="product-card">
                <img src="${itemArr.picture_url}" id="productImg">
                <h3>${itemArr.name}</h3>
                <p>${matchingCategoryName}</p>
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
        
        dropdown = $("#dropdown");
        productPrice = $("#productPrice");
        
        // loads product item varieties into the select dropdown
        $.each(itemArr.varieties, function(i, key){
            dropdown.append(`
                <option value="${key.name}">${key.name}</option>
                `);
        });
    }
    
    $(document).on('change', '#dropdown', function(){
        $.each(itemArr.varieties, function(i, key){
            if (dropdown.val() == key.name){
                productPrice.html(`$${key.price}`);
            }
        });
    });

    function getNextCartItemId(){
        let counter = localStorage.getItem("lastIndex");
        if (counter === null){
            counter = 0;
        } else {
            counter = parseInt(counter) + 1;
        }
        localStorage.setItem("lastIndex", counter);
        return counter;
    }

    $(document).on('click', "#add-to-cart-btn", function(){
        const price = productPrice.text().slice(1);
        let concatStr = `${itemArr.product_id},${price},${itemArr.name},${itemArr.picture_url},${matchingCategoryName}`;
        localStorage.setItem("cartItem" + getNextCartItemId(), concatStr);
    });
});