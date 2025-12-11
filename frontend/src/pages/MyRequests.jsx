import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dsxqbfocy/image/upload/v1764164357/ChatGPT_Image_Nov_24_2025_at_07_09_52_PM_sepqv3.png";

function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://sharify-vivy.onrender.com/api/borrow/my-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      setRequests(data.requests || []);
    };

    fetchRequests();
  }, []);

    const handleReturn = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sharify-vivy.onrender.com/api/borrow/${requestId}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRequests(prev =>
          prev.map(req =>
            req._id === requestId ? { ...req, status: "returned" } : req
          )
        );
        alert("Product returned successfully");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Return Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">My Borrow Requests</h1>

        <div className="cards-grid">
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            requests.map(req => (
              <div className="request-card" key={req._id}>

                
                {/* LEFT IMAGE */}
                <img
                  src={
                    req.item?.image && req.item.image.startsWith("http")
                      ? req.item.image
                      : DEFAULT_IMAGE_URL
                  }
                  alt={req.item?.title}
                  className="request-thumb"
                  
                />

                {/* RIGHT CONTENT */}
                <div className="request-info">

                  <div className="text-block">
                    <h3>{req.item?.title}</h3>

                    <p className="request-price">
                      ₹ {req.item?.pricePerDay || "N/A"} / day
                    </p>

                    <p>From: {new Date(req.startDate).toLocaleDateString()}</p>
                    <p>To: {new Date(req.endDate).toLocaleDateString()}</p>
                    <p>Days: {req.totalDays}</p>
                    <p><strong>Total: ₹ {req.totalCost}</strong></p>
                  </div>


                </div>
               <div className="right-block">
                  <span className={`status ${req.status}`}>{req.status}</span>

                  {req.status === "approved" && (
                    <button
                      className="btn return-btn"
                      onClick={() => handleReturn(req._id)}
                    >
                      Mark as Return
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRequests;
