let cart = [];

getCart();
featuredProduct();
createCategories("https://dummyjson.com/products/categories");
getProducts("https://dummyjson.com/products");

async function createCategories(url) {
    let categories = await getData(url, "categories");

    const categoriesElement = document.getElementById("categories");
    let categoriesHTML = "";

    categories.forEach((category, index) => {
        categoriesHTML += `
            <a onclick="selectCategory(${index})">"${category.name}"</a>
        `;
    });

    categoriesElement.innerHTML = categoriesHTML;
}

async function featuredProduct() {
    const featuredProductElement = document.getElementById("featured-product");
    const randomNumber = Math.floor(Math.random() * 194);

    let url = `https://dummyjson.com/products/${randomNumber}`;

    let featuredProduct = await getData(url, "singleProduct");

    let ratingHTML = "";
    const rating = Math.round(featuredProduct.rating);
    for (let i = 0; i < rating; i++) {
        ratingHTML += `<img src="assets/img/star.svg" class="star">`;
    }

    if (featuredProduct.rating < 5) {
        for (let i = 0; i < 5 - rating; i++) {
            ratingHTML += `<img src="assets/img/star.svg" class="star opacity">`;
        }
    }

    featuredProductElement.innerHTML = `
        <img src="${featuredProduct.thumbnail}" alt="${featuredProduct.title}">
        <div class="information">
            <h1>${featuredProduct.title}</h1>
            <p>${featuredProduct.description}</p>
            <div class="rating">
                ${ratingHTML}
            </div>
            <p class="price">$${featuredProduct.price}</p>
        </div>
    `;
}

async function getProducts(url) {
    let products = await getData(url, "products");

    createProducts(products);
}

async function selectCategory(index) {
    let url = `https://dummyjson.com/products/category/${categoryList[index].slug}`;
    let products = await getData(url, "products");

    createProducts(products);
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("search", function () {
    searchProducts();
});

async function searchProducts() {
    let searchInputValue = searchInput.value;

    let products = await getData(
        `https://dummyjson.com/products/search?q=${searchInputValue}`,
        "products"
    );

    createProducts(products);
}

function createProducts(productList) {
    const productsElement = document.getElementById("products");
    let productsHTML = "";

    if (productList.length < 1) {
        productsElement.innerHTML = "<h2>No products found</h2>";
        return;
    }

    productList.forEach((product) => {
        productsHTML += `
            <div class="product">
                <div class="information">
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                </div>
                <div class="actions">
                    <p>$${product.price}</p>
                    <a onclick='setCart(${product.id}, "add")'>Add to cart</a>
                </div>
            </div>
        `;
    });

    productsElement.innerHTML = productsHTML;
}

//* CART FUNCTIONS */
function setCart(data, type, update) {
    switch (type) {
        case "add":
            let existingProduct = cart.find(
                (product) => product.productId === data
            );

            if (existingProduct) {
                existingProduct.amount++;
            } else {
                cart.push({ productId: data, amount: 1 });
            }
            break;
        case "decrease":
            let product = cart.find((product) => product.productId === data);
            if (product.amount > 1) {
                product.amount--;
            } else {
                cart.forEach((product, index) => {
                    if (product.productId === data) {
                        cart.splice(index, 1);
                    }
                });

                if (update) {
                    createCart();
                }
            }
            break;
        case "remove":
            cart.forEach((product, index) => {
                if (product.productId === data) {
                    cart.splice(index, 1);
                }
            });

            if (update) {
                createCart();
            }
            break;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
}
