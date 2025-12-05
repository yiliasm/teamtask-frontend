import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      window.location.href = "/";
      return;
    }

    setToken(storedToken);

    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    setUserId(payload.id);

    fetchTasks(payload.id, storedToken);
  }, []);

  const fetchTasks = async (id, jwtToken) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await axios.put(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const columns = {
    NOT_STARTED: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  };

  tasks.forEach((task) => {
    columns[task.status || "NOT_STARTED"].push(task);
  });

  const formatDate = (value) => {
    if (!value) return "No due date";
    const d = new Date(value);
    return d.toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Tasks</h2>

      <div className="kanban-board">
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="kanban-column">
            <div className="column-title">
              {status.replace("_", " ")}
            </div>

            {items.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
                <div className="task-date">
                  Due: {formatDate(task.due_date)}
                </div>

                <div className="status-buttons">
                  <button
                    className="status-button status-notstarted"
                    onClick={() =>
                      updateTaskStatus(task.id, "NOT_STARTED")
                    }
                  >
                    To Do
                  </button>

                  <button
                    className="status-button status-inprogress"
                    onClick={() =>
                      updateTaskStatus(task.id, "IN_PROGRESS")
                    }
                  >
                    Progress
                  </button>

                  <button
                    className="status-button status-completed"
                    onClick={() =>
                      updateTaskStatus(task.id, "COMPLETED")
                    }
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {userId && token && (
        <TaskForm onTaskCreated={() => fetchTasks(userId, token)} />
      )}
    </div>
  );
}

export default Dashboard;
