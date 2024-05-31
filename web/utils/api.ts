
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getUser = () => API.get('/user');
export const updateUser = (data: any) => API.put('/user', data);
export const signupUser = (data: any) => API.post('/signup', data);
export const loginUser = (data: any) => API.post('/login', data);
