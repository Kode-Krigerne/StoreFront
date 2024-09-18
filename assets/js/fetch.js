let categoryList = "";

function getData(url, type) {
    return fetch(url)
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

            switch (type) {
                case "categories":
                    categoryList = data;
                    return data;
                case "products":
                    return data.products;
                default:
                    console.error("Invalid type");
            }
        })
        .catch((error) => console.error(error));
}
