import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    ChipProps,
    Input,
    Button,
    Pagination,
} from "@nextui-org/react";
import {columns, statusOptions} from "../data";
import React, {ReactNode, useEffect} from "react";
import {EditIcon} from "../components/icons/EditIcon.tsx";
import {DeleteIcon} from "../components/icons/DeleteIcon.tsx";
import {SearchIcon} from "../components/icons/SearchIcon.tsx";
import {PlusIcon} from "../components/icons/PlusIcon.tsx";
import {Link} from "react-router-dom";
import axios from "axios";

type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

interface Product {
    id: number;
    images: [string];
    description: string;
    name: string;
    price: number;
    status: string;
}

interface Column {
    uid: string,
    name: string,
    sortable: boolean,
}

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "primary",
    archive: "warning",
};

function getStatusColor(status: string): ChipColor  {
    const statusOption = statusOptions.find(option => option.name === status);
    if (statusOption) {
        return statusColorMap[statusOption.uid] || "default";
    }
    return "default";
}

const Products = () => {
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [filterValue, setFilterValue] = React.useState("");
    const [products, setProducts] = React.useState<Product[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const hasSearchFilter = Boolean(filterValue);

    const fetchData = () => {
        axios.get('http://localhost:3000/products').then((res) => {
            setProducts(res.data)
            setPages(Math.ceil(res.data.length / rowsPerPage))
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredItems = React.useMemo(() => {
        let filteredProducts = products;

        if (hasSearchFilter) {
            filteredProducts = filteredProducts.filter((product) =>
                product.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredProducts;
    }, [products, filterValue, hasSearchFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const deleteProduct = (id: number) => {
        const confirmModal = window.confirm('Вы уверены, что хотите удалить этот продукт?');
        if (!confirmModal) {
            return;
        }

        axios.delete(`http://localhost:3000/products/${id}`).then((res) => {
            if (res.status === 404) {
                alert('Продукт не найден');
                return;
            }
            fetchData();
        });
    };

    const renderCell = React.useCallback((product: Product, columnKey: React.Key) => {
        const cellValue: ReactNode | string | number | { data_url: string }[] = product[columnKey as keyof Product];

        switch (columnKey) {
            case "images":
                if (Array.isArray(cellValue)) {
                    const imageArray = cellValue as { data_url: string }[];
                    return (
                        <img
                            src={imageArray[0].data_url}
                            alt="Product Image"
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    );
                }
                break;
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">$ {cellValue}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={getStatusColor(product.status)} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Изменить продукт">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <Link to={`./edit/${product.id}`}><EditIcon/></Link>
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Удалить продукт">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <button onClick={() => deleteProduct(product.id)}><DeleteIcon/></button>
                          </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-end gap-3 items-end">
                    <Link to="./create">
                        <Button color="primary" endContent={<PlusIcon/>}>
                            Добавить продукт
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-3">

                </div>
                <div className="flex justify-end items-center">
                    <label className="flex items-center  text-default-400 text-small">
                        Строк на страницу
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);


    return (

            <>
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Поиск по названию..."
                    onClear={() => setQuery('')}
                    startContent={<SearchIcon/>}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onValueChange={onSearchChange}
                />
                <Table topContent={topContent}
                       bottomContent={
                           <div className="flex w-full justify-center">
                               <Pagination
                                   isCompact
                                   showControls
                                   showShadow
                                   color="secondary"
                                   page={page}
                                   total={pages}
                                   onChange={(page) => setPage(page)}
                               />
                           </div>
                       }
                       topContentPlacement="outside" isStriped aria-label="Example static collection table">
                    <TableHeader columns={columns}>
                        {(column: Column) => (
                            <TableColumn key={column.uid} align={"start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={items}>
                        {(item: Product) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </>
    );
}

export default Products;