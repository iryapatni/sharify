import {Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import MyRequests from "./pages/MyRequests";
import OwnerRequests from "./pages/OwnerRequests";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";


import './App.css'

function App() {

  return (
    <>
    <div className="app-wrapper">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/my-requests" element={<MyRequests/>}/>
          <Route path="/owner-requests" element={<OwnerRequests/>}/>
          <Route path="/create-product" element={<CreateProduct/>}/>
          <Route path="/edit-product/:id" element={<EditProduct/>}/>
          <Route path="/product/:id" element={<ProductDetails/>}/>

      </Routes>
      <Footer/>
    </div>
    </>
  )
}

export default App;
