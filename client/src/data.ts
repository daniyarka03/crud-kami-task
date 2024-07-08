const columns = [
    {name: "Картинка", uid: "images", sortable: true},
    {name: "Название", uid: "name", sortable: true},
    {name: "Статус", uid: "status", sortable: true},
    {name: "Цена", uid: "price", sortable: true},
    {name: "Действия", uid: "actions", sortable: false}
];

const statusOptions = [
    {name: "Активный", uid: "active"},
    {name: "Архивный", uid: "archive"}
];

export {columns, statusOptions};
