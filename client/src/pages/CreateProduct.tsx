import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Input,
    Image,
    Modal,
    ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";
import Editor from 'react-simple-wysiwyg';
import React, {useState} from "react";
import {Link} from "react-router-dom";
import ImageUploading from 'react-images-uploading';
import {CameraIcon} from "../components/icons/CameraIcon.tsx";
import axios from "axios";

interface ErrorsType {
    name?: string;
    price?: string;
    images?: string;
}

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<string>('0');
    const [html, setHtml] = useState('Описание товара');
    const [images, setImages] = React.useState([]);
    const [selectedKey, setSelectedKey] = useState("Активный");
    const [errors, setErrors] = useState<ErrorsType>({});
    const [isOpen, setOpen] = useState(false);

    const maxNumber = 70;

    const onOpenChange = () => {
        setOpen(!isOpen);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHtml(e.target.value);
    }

    const validateForm = () => {
        const newErrors: ErrorsType = {};

        if (!name.trim()) {
            setOpen(true);
            newErrors.name = 'Введите название товара';
        }

        if (!price) {
            setOpen(true);
            newErrors.price = 'Введите цену товара';
        }

        if (!images.length) {
            setOpen(true);
            newErrors.images = 'Добавьте изображение товара';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const createNewProductHandler = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = new FormData();

        data.append('name', name);
        data.append('price', price);
        data.append('description', html);
        data.append('status', selectedKey);
        images.forEach(image => {
            data.append('images', image.file);
        });

        axios.post('http://localhost:3000/products/create', data).then((res) => {
            if (res.status === 200 || res.status === 201) {
                window.location.href = '/products';
            }
        });
    }

    const onChangeImage = (imageList: []) => {
        setImages(imageList);
    };

    return (
        <div className="create-product">
            <h1>Новый продукт</h1>
            <form className="create-product__form">
                <Input required className="create-product__input" type="text" name="name" variant="bordered"
                       label="Название товара"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                />
                <label className="create-product__label">Описание</label>
                <Editor value={html} onChange={onChange}/>
                <label className="create-product__label">Статус</label>
                <Dropdown classNames={{
                    base: "create-product__dropdown"
                }}>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            className="capitalize"
                        >
                            {selectedKey}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKey}
                        onSelectionChange={(keys) => setSelectedKey(keys.values().next().value)}
                    >
                        <DropdownItem key="Активный">Активный</DropdownItem>
                        <DropdownItem key="Архивный">Архивный</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <label className="create-product__label">Фото продукта</label>
                <span className="create-product__sublabel">Нажмите или перетащите изображение чтобы добавить</span>
                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChangeImage}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                >
                    {({
                          imageList,
                          onImageUpload,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                      }) => (
                        <div className="upload__image-wrapper">
                            {imageList.map((image, index) => (
                                <div key={index} className="flex image-item align-middle">
                                    <Image className="create-product__image" src={image['data_url']} alt="" width="100"
                                           height="100"/>
                                    <div className="image-item__btn-wrapper">
                                        <Button className="create-product__image-controller" color="primary"
                                                onClick={() => onImageUpdate(index)}>Изменить</Button>
                                        <Button className="create-product__image-controller" color="danger"
                                                onClick={() => onImageRemove(index)}>Удалить</Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                style={isDragging ? {color: 'red'} : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                                startContent={<CameraIcon/>}
                            >
                            Добавить
                            </Button>
                        </div>
                    )}
                </ImageUploading>

                <Input className="create-product__input" type="number" name="price" variant="bordered"
                       label="Цена товара"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                />
                <Button className="create-product__button" color="primary"
                        onClick={createNewProductHandler}>Сохранить</Button>
                <Link to={"/products"}><Button color="default">Отмена</Button></Link>
            </form>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Заполните все поля!</ModalHeader>
                            <ModalBody>
                                <ul>
                                {
                                    Object.keys(errors).map((key, index) => {
                                        const errorKey = key as keyof ErrorsType;
                                        return (
                                            <li key={index}>- {errors[errorKey]}</li>
                                        )
                                    })
                                }
                                </ul>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Я понял Кэп!
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CreateProduct;