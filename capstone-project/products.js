
$(document).ready(function(){
    
    let categoriesArr = [];
    let productsArr = [];
    let productContainer = $(".product-container")[0];
    let cartIcon = $("#cart-icon");
    const template = $("#products-template")[0];
    const APIdomain = "http://3.136.18.203:8000/";
    const productsAPI = APIdomain + "products/";
    const categoriesAPI = APIdomain + "categories/";
    const fragment = document.createDocumentFragment();

    fetchProducts();
    updateCartNumber();

    async function fetchProducts(){
        try {            
            const productsResponse = await fetch(productsAPI);
            const categoriesResponse = await fetch(categoriesAPI);

            if (!productsResponse.ok){
                throw new Error("Failed to fetch products.");
            }
            if (!categoriesResponse.ok){
                throw new Error("Failed to fetch categories.");
            }
            productsArr = await productsResponse.json();
            categoriesArr = await categoriesResponse.json();

            loadProducts();
        } catch (e){
            alert(e);
        }
    }

    function loadProducts(){

        $.each(productsArr, function(i, product){
            let matchingCategoryName = "";
            const myElement = template.content.cloneNode(true);

            $.each(categoriesArr, function(i, category){
                if (category.category_id == product.category){
                    matchingCategoryName = category.name;
                }
            });
            
            myElement.querySelector(".product-card").href += product.product_id;
            myElement.querySelector(".pr-img").src = product.picture_url;
            myElement.querySelector(".pr-name").textContent = product.name;
            myElement.querySelector(".pr-category").textContent = matchingCategoryName;
            myElement.querySelector(".pr-starting-price").textContent += product.starting_at_price;
            myElement.querySelector(".pr-qty").textContent = product.product_id + " in Stock";
            myElement.querySelector(".pr-description").textContent = product.description;
            fragment.append(myElement);            
        });
        productContainer.append(fragment);
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