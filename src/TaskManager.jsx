import React, { useState, useEffect } from "react";
import axios from "axios";

// ================= API HELPERS =================
// NOTE: These are defined here to avoid build errors
// if ./api/taskApi path is missing or incorrect.
const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

const getTasks = () => API.get("/");
const apiAddTask = (text) => API.post("/", { text });
const apiToggleTask = (id) => API.put(`/${id}`);
const apiDeleteTask = (id) => API.delete(`/${id}`);
// ===============================================

export default function TaskManager() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const res = await apiAddTask(task);
      setTasks([res.data, ...tasks]);
      setTask("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await apiToggleTask(id);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiDeleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode
          ? "radial-gradient(circle at top, #020617, #000)"
          : "linear-gradient(135deg, #a5f3fc, #f0f9ff)",
      }}
    >
      <div
        style={{
          ...styles.container,
          background: darkMode
            ? "rgba(2,6,23,0.8)"
            : "rgba(255,255,255,0.75)",
          color: darkMode ? "#e5e7eb" : "#020617",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.brand}>✨ Task Manager</div>
          <button style={styles.darkBtn} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Progress */}
        <div style={styles.progressWrap}>
          <div
            style={{
              ...styles.progressBar,
              width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`,
            }}
          />
          <span style={styles.progressText}>
            {completedCount} / {tasks.length} completed
          </span>
        </div>

        {/* Input */}
        <div style={styles.inputBox}>
          <input
            style={styles.input}
            placeholder="What do you need to do today?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button style={styles.addBtn} onClick={addTask}>
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              style={filter === f ? styles.activeFilter : styles.filterBtn}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyText}>No tasks found</p>
            <span style={styles.emptySub}>Stay productive ✨</span>
          </div>
        ) : (
          <ul style={styles.list}>
            {filteredTasks.map((t) => (
              <li
                key={t._id}
                style={{
                  ...styles.listItem,
                  background: t.completed
                    ? "linear-gradient(135deg,#dcfce7,#f0fdf4)"
                    : "linear-gradient(135deg,#ffffff,#f8fafc)",
                  opacity: t.completed ? 0.75 : 1,
                }}
              >
                <span
                  style={{
                    ...styles.check,
                    background: t.completed ? "#22c55e" : "#fff",
                    color: t.completed ? "#fff" : "#22c55e",
                  }}
                  onClick={() => toggleTask(t._id)}
                >
                  {t.completed ? "✓" : ""}
                </span>

                <span
                  style={{
                    ...styles.taskText,
                    textDecoration: t.completed ? "line-through" : "none",
                  }}
                >
                  {t.text}
                </span>

                {t.completed && (
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTask(t._id)}
                  >
                    🗑
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
    transition: "all 0.4s",
  },
  container: {
    width: "440px",
    padding: "36px",
    borderRadius: "24px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    transition: "all 0.4s",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  brand: {
    fontSize: "22px",
    fontWeight: 700,
  },
  darkBtn: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  progressWrap: { marginBottom: "22px" },
  progressBar: {
    height: "8px",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#22c55e,#4ade80)",
    transition: "width 0.4s",
  },
  progressText: { fontSize: "12px", marginTop: "6px", display: "block" },
  inputBox: { display: "flex", gap: "12px", marginBottom: "22px" },
  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    outline: "none",
  },
  addBtn: {
    padding: "0 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#22c55e,#4ade80)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "22px",
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
  },
  activeFilter: {
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "16px",
    marginBottom: "12px",
    transition: "transform 0.2s",
  },
  check: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "2px solid #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "13px",
  },
  taskText: { flex: 1, fontSize: "15px" },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#ef4444",
  },
  emptyBox: { textAlign: "center" },
  emptyIcon: { fontSize: "40px" },
  emptyText: { fontWeight: 600 },
  emptySub: { fontSize: "14px", opacity: 0.7 },
};
