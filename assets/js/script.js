let cart = [];
let categorized = {
    Electronic: [],
    Clothing: [],
    Care: [],
    Vehicles: [],
    Other: [],
};
const productsContainerElement = document.getElementById("products-container");
const cartContainerElement = document.getElementById("cart");
const productViewElement = document.getElementById("product-view");

window.addEventListener("load", function () {
    categorize("https://dummyjson.com/products/categories");
    getCart();
    toggleView(sessionStorage.getItem("view") || "products", true);
});

function toggleView(view, update) {
    switch (view) {
        case "products":
            if (update) {
                featuredProduct();
                document.getElementById("featured-product").style.display =
                    "flex";
                getProducts("https://dummyjson.com/products");
            }

            cartContainerElement.style.display = "none";
            productsContainerElement.style.display = "flex";
            productViewElement.style.display = "none";
            sessionStorage.setItem("view", "products");
            break;
        case "cart":
            productsContainerElement.style.display = "none";
            cartContainerElement.style.display = "flex";
            productViewElement.style.display = "none";
            sessionStorage.setItem("view", "cart");
            createCart();
            break;
        case "productView":
            productsContainerElement.style.display = "none";
            cartContainerElement.style.display = "none";
            productViewElement.style.display = "flex";
            break;
    }
}

async function categorize(url) {
    let categories = await getData(url, "categories");

    for (let category of categories) {
        let slug = category.slug;

        switch (slug) {
            case "smartphones":
            case "tablets":
            case "laptops":
            case "mobile-accessories":
                categorized["Electronic"].push(category);
                break;

            case "mens-shirts":
            case "mens-shoes":
            case "mens-watches":
            case "womens-bags":
            case "womens-dresses":
            case "womens-jewellery":
            case "womens-shoes":
            case "womens-watches":
            case "sunglasses":
            case "tops":
                categorized["Clothing"].push(category);
                break;

            case "beauty":
            case "fragrances":
            case "skin-care":
                categorized["Care"].push(category);
                break;

            case "vehicle":
            case "motorcycle":
                categorized["Vehicles"].push(category);
                break;
            default:
                categorized["Other"].push(category);
                break;
        }
    }

    createCategories(categorized);
}

function createCategories(categories) {
    const categoriesElement = document.getElementById("categories");
    let categoriesHTML = "";

    Object.keys(categories).forEach((category) => {
        categoriesHTML += `
            <a onclick='selectCategory("${category}")'>${category}</a>
        `;
    });

    categoriesElement.innerHTML = categoriesHTML;
}

async function selectCategory(index) {
    let products = "";
    for (let category in categorized) {
        if (category === index) {
            for (let category of categorized[index]) {
                let productData = await getData(
                    `https://dummyjson.com/products/category/${category.slug}`,
                    "products"
                );

                products = [...products, ...productData];
            }
            toggleView("products");
            document.getElementById("featured-product").style.display = "none";

            createProducts(products);
        }
    }
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

    featuredProductElement.onclick = () => productView(randomNumber);
}

async function getProducts(url) {
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
                    <img onclick="productView(${product.id})" src="${product.thumbnail}" alt="${product.title}">
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

//* Product View Functions */
function makeStars(review) {
    let stars = "";
    for (let i = 0; i < review; i++) {
        stars += `<img src="assets/img/star.svg" class="star">`;
    }

    if (review < 5) {
        for (let i = 0; i < 5 - review; i++) {
            stars += `<img src="assets/img/star.svg" class="star opacity">`;
        }
    }

    return stars;
}

async function productView(productId) {
    let product = await getData(
        `https://dummyjson.com/products/${productId}`,
        "singleProduct"
    );

    let reviews = await getReviews(product);

    let tags = "";
    product.tags.forEach((tag) => {
        tags += `<span>${tag}</span>`;
    });

    toggleView("productView");

    let productViewHTML = "";

    productViewHTML += `
        <div class="container">
            <div class="product-container">
                <img src="${product.thumbnail}" />
                <div class="information">
                    <h1>${product.title}</h1>
                    <p>${product.description}</p>
                    <ol>
                        <li>Rating: ${product.rating}</li>
                        <li>Category: ${product.category}</li>
                        <li>Tags: ${tags}</li>
                    </ol>
                    <ul>
                        <li><p class="price">$${product.price}</p></li>
                        <li><a onclick='setCart(${productId}, "add")'>Add to cart</a></li>
                    </ul>
                </div>
            </div>
            <div class="product-reviews">
                ${reviews}
            </div>
        </div>
    `;

    productViewElement.innerHTML = productViewHTML;
}

async function getReviews(product) {
    let reviews = [];
    product.reviews.forEach((review, index) => {
        let stars = makeStars(review.rating, index);
        reviews += `
        <div class="review-container">
            <div class="profilePic">
            </div>
            <div class="review">
                <ul>
                    <li><h2>${review.reviewerName}</h2></li>
                    <li><div class="stars">${stars}</div></li>
                </ul>
                <p>${review.comment}</p>
            </div>
        </div>
        `;
    });

    return reviews;
}

//* CART FUNCTIONS */

function getCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    updateCartCounter();
}

function updateCartCounter(items, price) {
    const cartItemAmount = document.getElementById("cart-amount");

    cartItemAmount.innerHTML = cart.length;

    const cartElement = document.getElementById("cart-products");
    const totalItems = document.getElementById("total-items");
    const totalCost = document.getElementById("total-cost");
    if (cart.length < 1) {
        cartElement.innerHTML = "<h2>No products in cart</h2>";
    }

    totalItems.innerHTML = items ? `Total items: ${items}` : `Total items: 0`;
    totalCost.innerHTML = price
        ? `Total cost: $${price.toFixed(2)}`
        : `Total cost: $0.00`;
}

async function createCart() {
    if (cart.length < 1) {
        return;
    }

    const cartElement = document.getElementById("cart-products");

    let cartHTML = "";

    for (product of cart) {
        let productInfo = await getData(
            `https://dummyjson.com/products/${product.productId}`,
            "singleProduct"
        );

        let itemTotalPrice = product.amount * productInfo.price;

        cartHTML += `
            <div class="product">
                <img src="${productInfo.thumbnail}" alt="${
            productInfo.title
        }">    
                <div class="information">
                    <h3>${productInfo.title}</h3>
                    <p>$${productInfo.description}</p>
                </div>
                <div class="actions">
                    <div class="edit">
                        <p>$${itemTotalPrice.toFixed(2)}</p>
                        <div class="amount">
                            <a onclick='updateCart(event, ${
                                productInfo.id
                            }, "decrease")'><i class="fa-solid fa-minus"></i></a>
                            <p>${product.amount}</p>
                            <a onclick='updateCart(event, ${
                                productInfo.id
                            }, "increase")'><i class="fa-solid fa-plus"></i></a>
                        </div>
                    </div>
                    <a class="removeBTN" onclick='updateCart(event, ${
                        productInfo.id
                    }, "remove")'><i class="fa-solid fa-xmark"></i></a>
                </div>
            </div>
        `;
    }

    updateCart();

    cartElement.innerHTML = cartHTML;
}

function updateCart(data, productId, type) {
    if (productId) {
        const productElement = data.target.closest(".product");
        const productTotalPrice = productElement.querySelector(".edit p");
        const productAmount = productElement.querySelector(".amount p");

        const product = cart.find(
            (productInfo) => productInfo.productId === productId
        );

        if (
            type === "increase" ||
            (type === "decrease" && product.amount > 1)
        ) {
            setCart(productId, type);
        } else {
            setCart(productId, "remove");
            productElement.remove();
        }

        productAmount.textContent =
            type === "increase"
                ? parseInt(productAmount.textContent) + 1
                : parseInt(productAmount.textContent) - 1;

        productTotalPrice.textContent = `$${(
            product.amount * product.price
        ).toFixed(2)}`;
    }

    let totalAmount = 0;
    let totalPrice = 0;

    cart.forEach((product) => {
        totalAmount += product.amount;
        totalPrice += product.price * product.amount;
    });

    updateCartCounter(totalAmount, totalPrice);
}

async function setCart(data, type) {
    let product = "";
    switch (type) {
        case "add":
            let existingProduct = cart.find(
                (product) => product.productId === data
            );

            if (existingProduct) {
                existingProduct.amount++;
            } else {
                let productData = await getData(
                    `https://dummyjson.com/products/${data}`,
                    "singleProduct"
                );
                let price = productData.price;

                cart.push({
                    productId: data,
                    amount: 1,
                    price: price,
                });
            }
            break;

        case "increase":
            product = cart.find((product) => product.productId === data);
            if (product) {
                product.amount++;
            }
            break;

        case "remove":
            const productIndex = cart.findIndex(
                (product) => product.productId === data
            );
            if (productIndex !== -1) {
                cart.splice(productIndex, 1);
            }
            break;
        case "decrease":
            product = cart.find((product) => product.productId === data);
            if (product) {
                product.amount--;
            }
            break;
    }

    updateCartCounter();

    localStorage.setItem("cart", JSON.stringify(cart));
}
