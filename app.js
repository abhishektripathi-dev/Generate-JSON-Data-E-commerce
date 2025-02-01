const fs = require("fs");

// Sample categories
const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports",
    "Books",
    "Toys",
    "Furniture",
];

// Generate 200 products
const products = [];
for (let i = 1; i <= 200; i++) {
    const categoryId = Math.floor(Math.random() * categories.length) + 1;
    const product = {
        id: i,
        name: `Product ${i}`,
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)), // Random price between $10 and $500
        description: `This is a sample description for Product ${i}.`,
        // image: `https://example.com/images/product-${i}.jpg`,
        image: `https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWVuJ3MlMjBDYXN1YWwlMjBTaGlydHxlbnwwfHwwfHx8Mg%3D%3D`,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0 and 5.0
        reviews: [
            {
                user: `User${i}`,
                comment: `Great product! Review ${i}.`,
                rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3 and 5
            },
        ],
        categoryId: categoryId,
    };
    products.push(product);
}

// Organize data for json-server
const data = {
    products: products,
    categories: categories.map((name, index) => ({
        id: index + 1,
        name: name,
    })),
};

// Save to db.json
fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
console.log("Generated 200 products in db.json");
