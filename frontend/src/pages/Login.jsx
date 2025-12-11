import { useState } from "react";
import { useNavigate } from "react-router-dom"; //to redirect without reloading

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // setting initial email to "", then later when user types it re-renders and setEmail works
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://sharify-vivy.onrender.com/api/auth/login",  // backend deployed URL (replacing localhost)
      {
        method: "POST", // because react is sending data(email and password)
        headers: {
          // tells backend that the content i am sending is JSON, not regular plain text or form data
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }), // → Takes your JS object { email, password } → Converts it to a JSON string → That’s what travels over HTTP.
      }
    );

    const data = await response.json(); // converts HTTP response body to real JS object

    if (!response.ok) {
      console.log(data.message);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Login Successful");
      navigate("/products");
    }
  };

  return (
    <>
      <div className="page auth-page">
        <div className="page-container small">
          <h1 className="page-title">Login Page</h1>

          <form onSubmit={handleSubmit} className="form-box">
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">Login</button>
          </form>

          <div className="auto-switch">
            <p>
              Not Registered yet?{" "}
              <span
                className="auth-link"
                onClick={() => navigate("/register")}
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
