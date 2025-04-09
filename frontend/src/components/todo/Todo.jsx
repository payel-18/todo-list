import React, { useState, useEffect } from "react";
import "./todo.css";
import TodoCard from "./TodoCard";
import Update from "./Update";
import axios from "axios";

const Todo = () => {
  // States for task input, task list, updating task, and UI control
  const [inputs, setInputs] = useState({ title: "", body: "" });
  const [tasks, setTasks] = useState([]);
  const [toUpdateTask, setToUpdateTask] = useState({ title: "", body: "", _id: "" });
  const [isTextareaVisible, setIsTextareaVisible] = useState(false);
  const [showUpdateDiv, setShowUpdateDiv] = useState(false);

  // Show textarea when title input is clicked
  const handleInputClick = () => {
    setIsTextareaVisible(true);
  };

  // Update input field state on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Submit new task
  const handleSubmit = async () => {
    // Basic validation
    if (inputs.title.trim() === "" || inputs.body.trim() === "") {
      console.log("Title or body should not be empty");
      return;
    }

    const token = localStorage.getItem("token")?.trim();
    const userId = localStorage.getItem("id");

    // If authenticated user
    if (userId && token) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/addTask`,
          {
            title: inputs.title,
            body: inputs.body,
            id: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Clear inputs and refresh task list
        setInputs({ title: "", body: "" });
        setIsTextareaVisible(false);
        await fetchTasks();
      } catch (error) {
        console.error("Submit task failed:", error.response?.data || error.message);
      }
    } else {
      // For non-authenticated user (temporary)
      setTasks([...tasks, inputs]);
      setInputs({ title: "", body: "" });
    }
  };

  // Delete task by ID
  const handleDelete = async (cardId) => {
    const token = localStorage.getItem("token")?.trim();
    const userId = localStorage.getItem("id");

    if (!userId || !token) {
      console.warn("User ID or token missing.");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/deleteTask/${cardId}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task deleted successfully!");
      setTasks((prev) => prev.filter((task) => task._id !== cardId));
    } catch (error) {
      console.log("Delete failed:", error.message);
    }
  };

  // Show update form for selected task
  const handleUpdate = (index) => {
    const taskToUpdate = tasks[index];
    console.log("Clicked update:", taskToUpdate);
    setToUpdateTask(taskToUpdate);
    setShowUpdateDiv(true);
  };

  // Fetch tasks from server
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")?.trim();
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        console.error("Missing token or user ID in localStorage");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getTasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set fetched tasks or handle empty list
      if (response.data && response.data.list) {
        setTasks(response.data.list);
      } else if (response.data?.message === "No tasks found") {
        setTasks([]);
      } else {
        setTasks([]);
        console.error("Invalid tasks data received:", response.data);
      }
    } catch (error) {
      console.error("Fetch tasks failed:", error.response?.data || error.message);

      // Handle expired/invalid session
      if (error.response?.status === 403 || error.response?.data?.message === "Invalid token") {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) return;
    if (!token) {
      console.warn("Missing token.");
      return;
    }

    fetchTasks();
  }, []);

  return (
    <>
      {/* Input Section */}
      <div className="todo">
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={handleInputClick}
              name="title"
              value={inputs.title}
              onChange={handleChange}
            />
            <textarea
              placeholder="BODY"
              name="body"
              className="p-2 todo-inputs"
              value={inputs.body}
              onChange={handleChange}
              style={{ display: isTextareaVisible ? "block" : "none" }}
            />
          </div>
          <div className="w-lg-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>

        {/* Tasks Display Section */}
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {tasks.map((item, index) => (
                <div className="col-lg-3 col-11 mx-lg-5 mx-3 my-2" key={item._id || index}>
                  <TodoCard
                    title={item.title}
                    body={item.body}
                    id={item._id}
                    delid={handleDelete}
                    updateId={index}
                    toBeUpdate={handleUpdate}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Section */}
      {showUpdateDiv && (
        <div className="todo-update" id="todo-update">
          <Update
            key={toUpdateTask._id}
            display={() => setShowUpdateDiv(false)}
            update={toUpdateTask}
            onUpdateSuccess={fetchTasks}
          />
        </div>
      )}
    </>
  );
};

export default Todo;
