import axios from 'axios';

const API = axios.create({
    baseURL:"http://localhost:5000/api",
});

export const checkBackend = async () => {
    const response = await API.get("/test");
    return response.data;
};
export const testAI = async () => {
    const response = await API.post("/test-ai");
    return response.data;
};

export default API;