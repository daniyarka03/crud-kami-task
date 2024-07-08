const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(express.json());

app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let images = [];
let products = [
    {
        id: 1,
        name: "Apple iPhone 15 Pro Max",
        price: 2400,
        description: "Management",
        status: "Активный",
        images: [{data_url: "https://www.telstra.com.au/content/dam/tcom/devices/mobile/mhdwhst-15pm/bluetitanium/front.png"}],
    },
    {
        id: 2,
        name: "Samsung Galaxy S21 Ultra",
        price: 2000,
        description: "Management",
        status: "Активный",
        images: [{data_url: "https://oncharge.kz/image/cache/catalog/product-photo/010224/phone/samsung/s24ultra/yellow/69346.970-1000x1000.jpg"}],
    },
    {
        id: 3,
        name: "Xiaomi Redmi Note 10 Pro",
        price: 500,
        description: "Management",
        status: "Архивный",
        images: [{data_url: "https://cdn.dxomark.com/wp-content/uploads/medias/post-171171/bdc0df40e7c3983b73802b3d47dd20c4600x60085.jpg"}],
    }
];

// Маршрут для создания продукта
app.post('/products/create', upload.array('images', 10), (req, res) => {
    const { name, price, description, status } = req.body;
    const files = req.files;

    const images = files.map(file => ({
        data_url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        file: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size
        }
    }));

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
        status,
        images
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Маршрут для получения всех продуктов
app.get('/products', (req, res) => {
    res.json(products);
});

// Маршрут для получения продукта по ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send('Продукт не найден');
    }

    res.json(product);
});

// Маршрут для обновления продукта по ID
app.put('/products/:id', upload.array('images', 10), (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, price, description, status } = req.body;
    const files = req.files;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).send('Продукт не найден');
    }

    let images = products[productIndex].images;

    if (files && files.length > 0) {
        const newImages = files.map(file => ({
            data_url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            file: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size
            }
        }));
        images = images.concat(newImages);
    }

    products[productIndex] = {
        id: productId,
        name,
        price,
        description,
        status,
        images
    };

    res.json(products[productIndex]);
});

// Маршрут для удаления продукта по ID
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).send('Продукт не найден');
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});