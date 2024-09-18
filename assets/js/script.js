function createCategories(data) {
    const categories = document.querySelector(".categories");
    let categoriesHTML = "";

    data.forEach((category, index) => {
        categoriesHTML += `
            <a onclick="selectCategory(${index})">${category.name}</a>
        `;
    });

    categories.innerHTML = categoriesHTML;
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
                <a>Add to cart</a>
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
