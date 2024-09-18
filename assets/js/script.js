let cart = [];

getCart();
createCategories("https://dummyjson.com/products/categories");
getProducts("https://dummyjson.com/products");

async function createCategories(url) {
    let categories = await getData(url, "categories");

    const categoriesElement = document.querySelector(".categories");
    let categoriesHTML = "";

    categories.forEach((category, index) => {
        categoriesHTML += `
            <a onclick="selectCategory(${index})">${category.name}</a>
        `;
    });

    categoriesElement.innerHTML = categoriesHTML;
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
searchInput.addEventListener("change", function () {
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
    const productsElement = document.querySelector(".products");
    let productsHTML = "";

    if (productList.length < 1) {
        productsElement.innerHTML = "<h2>No products found</h2>";
        return;
    }

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
