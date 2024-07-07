import './App.css'
import {Route, Routes} from "react-router-dom";
import Products from "./pages/Products.tsx";
import CreateProduct from "./pages/CreateProduct.tsx";
import EditProduct from "./pages/EditProduct.tsx";

function App() {

  return (
        <Routes>
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
        </Routes>
  )
}

export default App
