import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    ChipProps, Input, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Pagination,
} from "@nextui-org/react";
import {columns, products, statusOptions} from "../data";
import React, {useEffect} from "react";
import {EyeIcon} from "../components/icons/EyeIcon.tsx";
import {EditIcon} from "../components/icons/EditIcon.tsx";
import {DeleteIcon} from "../components/icons/DeleteIcon.tsx";
import {ChevronDownIcon} from "../components/icons/ChevronDownIcon.tsx";
import {capitalize} from "../utils.ts";
import {SearchIcon} from "../components/icons/SearchIcon.tsx";
import {PlusIcon} from "../components/icons/PlusIcon.tsx";
import {Link} from "react-router-dom";
import axios from "axios";

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
    paused: "danger",
    vacation: "warning",
};

function getStatusColor(status: string): string {
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
    const [imgYooo, setImgYooo] = React.useState<string>('');
    const [query, setQuery] = React.useState('');
    const hasSearchFilter = Boolean(filterValue);

    useEffect(() => {
        axios.get('http://localhost:3000/products').then((res) => {
                setProducts(res.data)
                setPages(Math.ceil(res.data.length / rowsPerPage))

            console.log(res.data[3].images[0])
            setImgYooo(res.data[3].images[0])
        });
    }, []);
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...products];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }


        return filteredUsers;
    }, [products, filterValue]);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return products.slice(start, end);
    }, [page, products, rowsPerPage]);

    // const onSearchChange = React.useCallback((value?: string) => {
    //     if (value) {
    //         setFilterValue(value);
    //         setPage(1);
    //     } else {
    //         setFilterValue("");
    //     }
    // }, []);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onClear = React.useCallback(()=>{
        setFilterValue("")
        setPage(1)
    },[])


    const renderCell = React.useCallback((product: Product, columnKey: React.Key) => {
        const cellValue = product[columnKey as keyof Product];

        switch (columnKey) {
            case "images":
                return (
                    <img
                        src={cellValue[0].data_url}
                        alt={cellValue[0]}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                );
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
                        {/*<Tooltip content="Посмотреть детальнее">*/}
                        {/*  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">*/}
                        {/*    <EyeIcon/>*/}
                        {/*  </span>*/}
                        {/*</Tooltip>*/}
                        <Tooltip content="Изменить продукт">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <Link to={`./edit/${product.id}`}><EditIcon/></Link>
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Удалить продукт">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <Link to={`./edit/${product.id}`}><DeleteIcon/></Link>
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
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Поиск по названию..."
                        startContent={<SearchIcon/>}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Link to="./create">
                        <Button color="primary" endContent={<PlusIcon/>}>
                            Добавить продукт
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-3">

                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {products && products.length} Products</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
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


    return (
        <>
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
    )
}

export default Products;