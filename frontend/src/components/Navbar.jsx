import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo">Sharify</h2>
      </div>

      <div className="nav-center">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/products">Products</Link>

        {user && (
          <>
            <Link className="nav-link" to="/my-requests">My Requests</Link>
            <Link className="nav-link" to="/owner-requests">Owner Requests</Link>
            <Link className="nav-link add-product-link" to="/create-product">
              + Add Product
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        ) : (
          <>
            <span className="welcome-text"><i>Welcome, <b>{user.name}</b></i></span>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
