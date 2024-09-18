let categoryList = "";
getData("https://dummyjson.com/products/categories", "categories");
getData("https://dummyjson.com/products", "products");

function getData(url, type) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (!data) {
                throw new Error("No data found");
            }
            handleFetch(data, type);
        })
        .catch((error) => console.error(error));
}

function handleFetch(data, type) {
    switch (type) {
        case "categories":
            categoryList = data;
            createCategories(data);
            break;
        case "products":
            createProducts(data);
            break;
        case "category":
            createProducts(data);
            break;
        case "search":
            let products = data.products;

            if (products.length <= 0) {
                console.log("No search results");
                return;
            }
            createProducts(data);
            break;
        default:
            console.error("Invalid type");
    }
}
