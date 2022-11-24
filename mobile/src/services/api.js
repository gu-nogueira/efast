import { BASE_URL } from '@env';
import axios from 'axios';

class ApiConnector {
  constructor() {
    this.api;
    this.init();
  }

  init() {
    this.api = axios.create({
      baseURL: BASE_URL,
    });
  }
}

export default new ApiConnector().api;
