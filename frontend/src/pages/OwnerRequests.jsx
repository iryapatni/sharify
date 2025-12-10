import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dsxqbfocy/image/upload/v1764164357/ChatGPT_Image_Nov_24_2025_at_07_09_52_PM_sepqv3.png";

function OwnerRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchOwnerRequests = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/borrow/owner-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      setRequests(data.requests || []);
    };

    fetchOwnerRequests();
  }, []);

  const handleAction = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/api/borrow/${id}/${status}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    setRequests(prev =>
      prev.map(r => (r._id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">Requests For My Items</h1>

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

                {/* RIGHT SECTION */}
                <div className="request-info">

                  <div className="text-block">
                    <h3>{req.item?.title || "Product not available"}</h3>

                    <p className="request-price">
                      ₹ {req.item?.pricePerDay || "N/A"} / day
                    </p>

                    {req.startDate && req.endDate && (
                      <>
                        <p>From: {new Date(req.startDate).toLocaleDateString()}</p>
                        <p>To: {new Date(req.endDate).toLocaleDateString()}</p>
                        <p>Days: {req.totalDays}</p>
                        <p><strong>Total: ₹ {req.totalCost}</strong></p>
                      </>
                    )}

                    <p>Requested by <strong>{req.requester?.name}</strong></p>
                  </div>

                  <div className="right-block">
                    <span className={`status ${req.status}`}>{req.status}</span>

                    {req.status === "pending" && (
                      <div className="request-actions">
                        <button className="btn" onClick={() => handleAction(req._id, "approve")}>
                          Approve
                        </button>
                        <button className="btn btn-danger" onClick={() => handleAction(req._id, "reject")}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerRequests;
