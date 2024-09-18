let cart = [];

getCart();

function createCategories(categories) {
    const categoriesElement = document.querySelector(".categories");
    let categoriesHTML = "";

    categories.forEach((category, index) => {
        categoriesHTML += `
            <a onclick="selectCategory(${index})">${category.name}</a>
        `;
    });

    categoriesElement.innerHTML = categoriesHTML;
}

function createProducts(data) {
    const products = document.querySelector(".products");
    let productList = data.products;
    let productsHTML = "";

    productList.forEach((product) => {
        productsHTML += `
            <div class="product">
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
                <a onclick='setCart(${product.id}, "add")'>Add to cart</a>
            </div>
        `;
    });

    products.innerHTML = productsHTML;
}

function selectCategory(index) {
    let url = categoryList[index].url;
    getData(url, "category");
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("change", function () {
    searchProducts();
});

function searchProducts() {
    let searchInputValue = searchInput.value;

    getData(
        `https://dummyjson.com/products/search?q=${searchInputValue}`,
        "search"
    );
}

//* CART FUNCTIONS */
function setCart(data, type) {
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
        case "remove":
            break;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
}
