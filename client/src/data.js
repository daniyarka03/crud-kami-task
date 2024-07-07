const columns = [
    {name: "Картинка", uid: "images", sortable: true},
    {name: "Название", uid: "name", sortable: true},
    {name: "Статус", uid: "status", sortable: true},
    {name: "Цена", uid: "price", sortable: true},
    {name: "Действия", uid: "actions", sortable: false}
];

const statusOptions = [
    {name: "Активный", uid: "active"},
    {name: "Архивный", uid: "vacation"}
];

const products = [
    {
        id: 1,
        name: "Apple iPhone 15 Pro Max",
        price: 2400,
        description: "Management",
        status: "In Stock",
        image: "https://www.telstra.com.au/content/dam/tcom/devices/mobile/mhdwhst-15pm/bluetitanium/front.png",
    },
    {
        id: 2,
        name: "Samsung Galaxy S21 Ultra",
        price: 2000,
        description: "Management",
        status: "Not Available",
        image: "https://oncharge.kz/image/cache/catalog/product-photo/010224/phone/samsung/s24ultra/yellow/69346.970-1000x1000.jpg",
    },
    {
        id: 3,
        name: "Xiaomi Redmi Note 10 Pro",
        price: 500,
        description: "Management",
        status: "Out of Stock",
        image: "https://cdn.dxomark.com/wp-content/uploads/medias/post-171171/bdc0df40e7c3983b73802b3d47dd20c4600x60085.jpg",
    }

];

export {columns, products, statusOptions};
