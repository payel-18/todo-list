import React, { useState, useEffect } from 'react';
import axios from "axios";

// Update component for editing an existing task
const Update = ({ display, update, onUpdateSuccess }) => {
  // Local state to manage the input fields
  const [inputs, setInputs] = useState({ title: "", body: "" });

  // Populate inputs with existing task data when 'update' changes
  useEffect(() => {
    if (update) {
      setInputs({
        title: update.title || "",  // Set title if available
        body: update.body || ""     // Set body if available
      });
    }
  }, [update]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value }); // Update state dynamically
  };

  // Submit updated task
  const submit = async () => {
    if (!update?._id) return; // Ensure task ID is present

    const token = localStorage.getItem("token")?.trim(); // Get token

    try {
      // Make PUT request to update task
      await axios.put(
        `https://todo-list-1lk0.onrender.com/api/v2/updateTask/${update._id}`,
        inputs,
        {
          headers: {
            Authorization: `Bearer ${token}` // Send token in headers
          }
        }
      );

      alert("Task updated successfully!"); // Notify user
      if (onUpdateSuccess) onUpdateSuccess(); // Refresh tasks if callback exists
      display(); // Close the update form
    } catch (error) {
      console.error("Update failed:", error.message); // Log error
    }
  };

  return (
    <div className="p-5 d-flex justify-content-center align-items-center flex-column update">
      <h3>Update Your Task</h3>

      {/* Title input field */}
      <input
        type="text"
        className='todo-inputs my-4 w-100 p-3'
        name="title"
        value={inputs.title}
        onChange={handleChange}
      />

      {/* Body textarea */}
      <textarea
        className='todo-inputs w-100 p-3'
        name="body"
        value={inputs.body}
        onChange={handleChange}
      />

      {/* Buttons to submit or close */}
      <div>
        <button className='btn btn-dark my-4 p-1' onClick={submit}>Update</button>
        <button className='btn btn-danger my-4 mx-3 p-1' onClick={() => display(false)}>Close</button>
      </div>
    </div>
  );
};

export default Update;
