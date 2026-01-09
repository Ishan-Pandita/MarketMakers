//axios used to make HTTP requests(GET,POST,PUT,DELETE)
import axios from "axios";
//axios instance - a custom axios object with default settings don,t repeat base url evrywhere
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//attach tokens automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
