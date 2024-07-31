import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the base URL from the .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;
