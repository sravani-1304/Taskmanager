import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks"
});

export const getTasks = () => API.get("/");
export const addTask = (text) => API.post("/", { text });
export const toggleTask = (id) => API.put(`/${id}`);
export const deleteTask = (id) => API.delete(`/${id}`);
const BASE_URL = "http://localhost:5000/api/tasks";
