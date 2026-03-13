import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Signup() {

  const navigate = useNavigate();

  const [user,setUser] = useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e)=>{
    setUser({...user,[e.target.name]:e.target.value});
  }

  const handleSubmit = (e)=>{
    e.preventDefault();

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");
  }

  return(

    <div className="auth-container">

  <h1 className="app-title">PG Management</h1>

  <div className="auth-card">

    <h2>Signup</h2>

        <form onSubmit={handleSubmit}>

          <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          />

          <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          />

          <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          />

          <button>Signup</button>

        </form>

        <p>
          Already a user? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>

  );
}

export default Signup;