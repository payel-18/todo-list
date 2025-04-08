import React, { useState } from 'react';
import './Register.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const history = useNavigate(); // For navigating to different routes after registration

  // State to store form input values
  const [Inputs, setInputs] = useState({ email: "", username: "", password: "" });

  // Update state on input change
  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Send POST request to backend with user inputs
    await axios.post("http://localhost:1000/api/v1/register", Inputs).then((response) => {
      if(response.data.message === "User already exist"){
        alert(response.data.message); // Show error if user exists
      } else {
        alert(response.data.message); // Show success message
        setInputs({ email: "", username: "", password: "" }); // Reset form
        history("/login"); // Navigate to login page
      }
    });
  };

  return (
    <div className="container mt-5 register-form">
      <h2 className="text-center mb-4">Register</h2>

      {/* Registration form */}
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="username"
            placeholder="Enter your full name"
            onChange={change}
            value={Inputs.username}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={change}
            value={Inputs.email}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={change}
            value={Inputs.password}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" onClick={submit}>Register</button>
      </form>
    </div>
  );
};

export default Register;
