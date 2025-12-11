import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dsxqbfocy/image/upload/v1764164357/ChatGPT_Image_Nov_24_2025_at_07_09_52_PM_sepqv3.png";

function Products() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://sharify-vivy.onrender.com/api/products");
      const data = await response.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">All Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)} // 👉 Navigate to details
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                product.image && product.image.startsWith("http")
                  ? product.image
                  : DEFAULT_IMAGE_URL
              }
              alt={product.title}
              className="product-image"
            />

            <h3>{product.title}</h3>

            <p className="product-category">
              <strong>{product.category}</strong>
            </p>

            <p className="product-price">₹ {product.pricePerDay} / day</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
