import axios from "axios";

// Create a reusable Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // my backend URL
  headers: {
    "Content-Type": "application/json",
  },
});



export default API; 