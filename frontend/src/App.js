import React, { useEffect } from 'react';
// Importing custom components
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Todo from './components/todo/Todo';

// Importing routing and redux related hooks
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from './store';

const App = () => {
  const dispatch = useDispatch();

  // When the app loads, check if sessionStorage has an "id"
  // If yes, it means user is already logged in — so update the redux store
  useEffect(() => {
    const id = sessionStorage.getItem("id");
    if (id) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  return (
    <div>
      {/* Setting up React Router */}
      <Router>
        {/* Display the navbar at the top across all pages */}
        <Navbar />
        
        {/* Define routes and the components they should render */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/todo" element={<Todo />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
