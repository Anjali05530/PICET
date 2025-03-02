import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePerson } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { RiLock2Line } from "react-icons/ri";
import { IoEyeOutline, IoEyeOff } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import "../Styles/Register.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [domain, setDomain] = useState("Select Domain");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const domains = ["Computer Science", "Graphics Designing", "Artificial Intelligence", "Cybersecurity", "Cloud Computing", "IOT", "Data Science", "Other"];

    const validateField = (field, value) => {
        let errorMessage = "";
        if (field === "name" && !/^[a-zA-Z\s_]+$/.test(value)) {
            errorMessage = "Name should only contain letters, spaces, and underscores.";
        } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errorMessage = "Invalid email format.";
        } else if (field === "password" && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
            errorMessage = "Password must be at least 8 characters, include a letter, number, and special character.";
        } else if (field === "confirmPassword" && value !== password) {
            errorMessage = "Passwords do not match.";
        }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (Object.values(errors).some(error => error !== "") || !name || !email || !password || !confirmPassword || domain === "Select Domain") {
            setServerError("Please fill out all fields correctly.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, domain })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }
            alert("Registration successful! Redirecting to login...");
            navigate("/");
        } catch (error) {
            setServerError(error.message);
        }
    };

    return (
        <div className="signup-container">
            <h1 className="register">Register</h1>
            {serverError && <p className="error-message">{serverError}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <MdOutlinePerson className="icon" />
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => validateField("name", name)} />
                </div>
                {errors.name && <p className="error">{errors.name}</p>}

                <div className="input-group">
                    <TfiEmail className="icon" />
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => validateField("email", email)} />
                </div>
                {errors.email && <p className="error">{errors.email}</p>}

                <div className="input-group dropdown-container" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <span className="icon">{domain}</span>
                    <FaChevronDown className="dropdown-icon" />
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {domains.map((item, index) => (
                                <div key={index} className="dropdown-item" onClick={() => { setDomain(item); setDropdownOpen(false); }}>{item}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="input-group">
                    <RiLock2Line className="icon" />
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => validateField("password", password)} />
                    <span className="toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IoEyeOff /> : <IoEyeOutline />}</span>
                </div>
                {errors.password && <p className="error">{errors.password}</p>}

                <div className="input-group">
                    <RiLock2Line className="icon" />
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => validateField("confirmPassword", confirmPassword)} />
                    <span className="toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <IoEyeOff /> : <IoEyeOutline />}</span>
                </div>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                <button className="register-btn" type="submit">Register</button>
                <p className="login-link">Already have an account? <Link to="/">Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;
