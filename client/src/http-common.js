import axios from "axios";

//Dev
//baseURL: "http://localhost:8081/api",

//Prod
//baseURL: "/api",

export default axios.create({
  baseURL: "/api",
  headers: {
    "Content-type": "application/json"
  }
});