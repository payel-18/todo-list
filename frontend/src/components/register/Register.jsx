import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const history = useNavigate();

  // Form inputs state
  const [Inputs, setInputs] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Input handler
  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  // Form submit handler
  const submit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!Inputs.email || !Inputs.username || !Inputs.password) {
      alert('Please fill in all fields!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://todo-list-1lk0.onrender.com/api/v1/register',
        Inputs
      );

      if (response.data.message === 'User already exist') {
        alert(response.data.message);
      } else {
        alert(response.data.message);
        setInputs({ email: '', username: '', password: '' });
        history('/login');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 register-form">
      <h2 className="text-center mb-4">Register</h2>

      <form onSubmit={submit}>
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

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
