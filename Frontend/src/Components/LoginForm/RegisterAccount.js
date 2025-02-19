import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Check if a token is stored
  );

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignIn
        ? "https://login-user-six.vercel.app/api/login"
        : "https://login-user-six.vercel.app/api/register";

      const payload = isSignIn
        ? { email: formData.email, password: formData.password }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(endpoint, payload);

      const token = response.data.token; // Assume the token is in the response
      localStorage.setItem("token", token); // Store token in local storage
      setIsAuthenticated(true); // Update state

      Swal.fire({
        title: "Success",
        text: isSignIn
          ? "You are successfully signed in!"
          : "Your account has been created!",
        icon: "success",
      }).then(() => {
        window.location.href = process.env.REACT_APP_FRONTEND_BASE_URL;
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <StyledWrapper>
      <nav>
        <ul>
          {isAuthenticated ? (
            <li>
              <button onClick={handleSignOut} className="signout-btn">
                <i className="fa fa-sign-out" /> Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link to="/account">
                {/* <i className="fa fa-user-o" /> Sign In / Sign Up */}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {isSignIn ? (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Sign In</p>
          <p className="message">Welcome back! Please enter your details.</p>
          <label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span>Email</span>
          </label>
          <label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span>Password</span>
          </label>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
          <p className="toggle">
            Don't have an account?{" "}
            <a href="#" onClick={toggleForm}>
              Sign Up
            </a>
          </p>
        </form>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Register</p>
          <p className="message">Signup now and get full access to our app.</p>
          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <span>First Name</span>
            </label>
            <label>
              <input
                className="input"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <span>Last Name</span>
            </label>
          </div>
          <label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span>Email</span>
          </label>
          <label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span>Password</span>
          </label>
          <label>
            <input
              className="input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span>Confirm Password</span>
          </label>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p className="toggle">
            Already have an account?{" "}
            <a href="#" onClick={toggleForm}>
              Sign In
            </a>
          </p>
        </form>
      )}
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    padding: 20px;
    border-radius: 20px;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.5s ease-in-out;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
    position: relative;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #00bfff;
  }

  .title::after {
    animation: pulse 1s linear infinite;
  }

  .message,
  .toggle {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .toggle {
    text-align: center;
  }

  .toggle a {
    color: #00bfff;
    cursor: pointer;
    text-decoration: none;
  }

  .toggle a:hover {
    text-decoration: underline;
  }

  .form label {
    position: relative;
    width: 100%;
  }

  .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 15px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.5);
    border-radius: 10px;
    font-size: medium;
    transition: border 0.3s ease;
  }

  .input:focus {
    border-color: #00bfff;
    box-shadow: 0px 0px 8px rgba(0, 191, 255, 0.5);
  }

  .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    background-color: #00bfff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: #009acd;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default AuthForm;
