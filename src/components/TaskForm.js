import { useState } from "react";
import axios from "axios";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Not authorized.");
      window.location.href = "/";
      return;
    }

    // handle jwt's
    let payload = null;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      alert("Invalid token. Please log in again.");
      window.location.href = "/";
      return;
    }

    const userId = payload.id;

    try {
      await axios.post(
        "http://localhost:4000/api/tasks",
        {
          title,
          description,
          due_date: dueDate,
          created_by: userId,
          assigned_to: userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTitle("");
      setDescription("");
      setDueDate("");

      onTaskCreated(); // rrefresh tasks

    } catch (err) {
      console.error("Task creation error:", err);
      alert("Error creating task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 30, maxWidth: 450 }}>
      <h3>Create a New Task</h3>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <button type="submit" style={{ width: "100%", padding: 12 }}>
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
