import axios from 'axios';

const api = axios.create({
  // ** AVD default IP address
  baseURL: 'http://10.0.2.2:2000',
});

export default api;
