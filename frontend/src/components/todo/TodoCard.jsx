import React from 'react'; 
import { MdDelete } from "react-icons/md"; // Import delete icon
import { GrUpdate } from "react-icons/gr"; // Import update icon

// Functional component to display a single todo card
const TodoCard = ({ title, body, id, delid, updateId, toBeUpdate }) => {
  return (
    <div className='p-3 todo-card'> {/* Card container */}
      
      {/* Display title and truncated body */}
      <div>
        <h6>{title}</h6>
        <p className="todo-card-p">
          {body.slice(0, 77)}... {/* Show first 77 characters of body */}
        </p>
      </div>

      {/* Action buttons: Update and Delete */}
      <div className="d-flex justify-content-around">

        {/* Update button */}
        <div
          className="d-flex justify-content-center align-items-center card-icons-head px-2 py-1"
          onClick={() => toBeUpdate(updateId)} // Trigger update function with index
        >
          <GrUpdate className="card-icons" /> {/* Update icon */}
          Update
        </div>

        {/* Delete button */}
        <div
          className="d-flex justify-content-center align-items-center card-icons-head px-2 py-1 text-danger"
          onClick={() => delid(id)} // Trigger delete function with task id
        >
          <MdDelete className="card-icons del" /> {/* Delete icon */}
          Delete
        </div>
        
      </div>
    </div>
  );
};

export default TodoCard; // Export the component
