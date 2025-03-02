import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash,FaUserCircle } from "react-icons/fa";
import "../Styles/style.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", 
      {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful! Redirecting...");
      navigate("/Home"); // Redirect user after login
    } 
    catch (err) 
    {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <FaUserCircle className="login-icon" />
        <h2>Login</h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            type="email"
            placeholder="Email Address/Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showPassword ? (
            <FaEyeSlash className="password-toggle" onClick={() => setShowPassword(false)} />
          ) : (
            <FaEye className="password-toggle" onClick={() => setShowPassword(true)} />
          )}
        </div>

        <button type="submit">Login</button>
      </form>
      <p>
        <a href="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </a>
      </p>

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
