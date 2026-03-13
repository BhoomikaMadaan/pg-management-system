import React,{useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if(!storedUser){
      alert("No account found. Please sign up first.");
      navigate("/");
      return;
    }

    if(
      storedUser.email === email &&
      storedUser.password === password
    ){
      navigate("/dashboard");
    }
    else{
      alert("Invalid credentials");
    }
  }
return(

  <div className="auth-container">

    <h1 className="app-title">PG Management</h1>

    <div className="auth-card">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          />

          <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          />

          <button>Login</button>

        </form>

        <p>
          New user? <Link to="/">Signup</Link>
        </p>

      </div>

    </div>

  )
}

export default Login