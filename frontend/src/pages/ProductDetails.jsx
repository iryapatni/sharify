import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dsxqbfocy/image/upload/v1764164357/ChatGPT_Image_Nov_24_2025_at_07_09_52_PM_sepqv3.png";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchProduct = async () => {
      const res = await fetch(
        `https://sharify-d4py.onrender.com/api/products/${id}`
      );

      const data = await res.json();
      setProduct(data.product);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const isOwner = product.owner?._id === user?.id;

  // ===== BORROW HANDLER =====
  const handleBorrow = async () => {
    const token = localStorage.getItem("token");

    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    const response = await fetch("https://sharify-d4py.onrender.com/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: product._id,
          startDate,
          endDate,
        }),
      });


    const data = await response.json();
    alert(data.message);
  };

  // ===== DELETE HANDLER =====
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://sharify-d4py.onrender.com/api/products/${product._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );


    const data = await response.json();

    if (response.ok) {
      alert("Product deleted successfully");
      navigate("/products");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="details-wrapper">

      <div className="details-card">

        {/* PRODUCT IMAGE */}
        <img
          src={
            product.image && product.image.startsWith("http")
              ? product.image
              : DEFAULT_IMAGE_URL
          }
          alt={product.title}
          className="details-img"
        />

        {/* PRODUCT INFO */}
        <div className="details-info">

          <h1 className="details-title">{product.title}</h1>

          <p className="details-category">{product.category}</p>

          <p className="details-price">
            ₹ {product.pricePerDay} <span>/ day</span>
          </p>

          <p className="details-description">{product.description}</p>

          <span className={`details-status ${product.status}`}>
            {product.status}
          </span>

          {/* OWNER ACTION BUTTONS */}
          {isOwner && (
            <div className="owner-actions">
              <button
                className="btn"
                onClick={() => navigate(`/edit-product/${product._id}`)}
              >
                Edit
              </button>

              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}

          {/* BORROW SECTION (NON-OWNER) */}
          {!isOwner && product.status === "available" && (
            <div className="borrow-box">
              <h3>Borrow this item</h3>

              <div className="borrow-row">

                <div className="borrow-field">
                  <label>From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="borrow-field">
                  <label>To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <button className="btn borrow-btn" onClick={handleBorrow}>
                  Send Borrow Request
                </button>

              </div>
            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
