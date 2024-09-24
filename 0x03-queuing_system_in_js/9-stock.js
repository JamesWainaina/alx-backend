const express = require('express');
const redis = require('redis');
const { promisify } = require('util');


const app = express();
const port = 1245;

const client = redis.createClient();


// Promisify the redis get and set methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const listProducts = [
  {
    id: 1,
    name: "Suitcase 250",
    price: 50,
    stock: 4,
  },
  {
    id: 2,
    name: "Suitcase 450",
    price: 100,
    stock: 10,
  },
  {
    id: 3,
    name: "Suitcase 650",
    price: 50,
    stock: 2,
  },
  {
    id: 4,
    name: "Suitcase 1050",
    price: 550,
    stock: 5,
  },
];

const getItemById = (id) => {
    return listProducts.find((product) => product.id === id);
}

// function to reserve stock by itemId
async function reserveStockById(itemId, stock){
   await setAsync(`item:${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    const stock = await getAsync(`item:${itemId}`);
    return stock ? parseInt(stock) : 0;
}

// Middleware to set JSON response header
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// route to list all products
app.get("/list_products", (req, res) => {
  res.json(listProducts.map((product) => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  })));
});

// Route to get product details and current available stock
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = listProducts.find((p) => p.id === itemId);

    if(!product) {
        res.status(404).json( { status: "Product not found" });
    } else {
        const currentQuantity = await getCurrentReservedStockById(itemId);
        res.json({ ...product, currentQuantity});
    }
});


// Route to reserve a product
app.get("/reserve_product/:itemId", async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = listProducts.find((p) => p.id === itemId);

    if (!product) {
        res.status(404).json({ status: "Product not found" });
    } else {
        const currentQuantity = await getCurrentReservedStockById(itemId);

        if (currentQuantity <= 0) {
            res.json({ status : "Not enough stock available",  itemId});
        } else {
            await reserveStockById(itemId, currentQuantity - 1);
            res.json( { status: "Reservation confirmed", itemId });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})