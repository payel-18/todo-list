import React, { useState } from 'react';
import "./Login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store';

const Login = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [Inputs, setInputs] = useState({ email: "", password: "" });

  // handle input changes
  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  // handle form submit
  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://todo-list-1lk0.onrender.com/api/v1/login", Inputs);
      const { token, user } = response.data;

      // store user info and token
      localStorage.setItem("token", token);
      localStorage.setItem("id", user._id);
      sessionStorage.setItem("username", response.data.user.username);

      dispatch(authActions.login());
      history("/todo");
    } catch (error) {
      alert("Invalid Credentials or Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2 className="text-center">Login</h2>

        {/* email input */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Enter your email"
            value={Inputs.email}
            onChange={change}
          />
        </div>

        {/* password input */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Enter your password"
            value={Inputs.password}
            onChange={change}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" onClick={submit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
