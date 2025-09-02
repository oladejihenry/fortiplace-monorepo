import axios from "./axios";

export const getCsrfToken =  () => axios.get("/sanctum/csrf-cookie")