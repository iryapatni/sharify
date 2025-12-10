import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate=useNavigate();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const response=await fetch("http://localhost:8080/api/auth/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name,email,password})
        });

        const data=await response.json();

        if(!response.ok){
            alert(data.message);
        }else{
            alert("Registration Successful");
            navigate("/login");
        }
    };

    return (
        <>
         <div className="page auth-page">
            <div className="page-container small">
                <h1 className="page-title">Register Page</h1>

                    <form onSubmit={handleSubmit} className="form-box">
                        <div>
                        <label>Name:</label>
                        <input
                        type="text"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        />
                        </div>

                        <div>
                        <label>Email:</label>
                        <input
                        type="text"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                        </div>

                        <div>
                        <label>Password:</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                        </div>

                        <button type="submit" className="btn">Register</button>

                    </form>
                                        <div className="auto-switch">
                        <p>
                            Already have an account?{" "}
                            <span className="auth-link" onClick={() => navigate("/login")}>
                            Login
                            </span>
                        </p>
                        </div>
            </div>
        </div>
        </>
    );
}

export default Register;