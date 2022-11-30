import { BASE_URL } from '@env';
import axios from 'axios';

class ApiConnector {
  constructor() {
    this.api;
    this.init();
  }

  init() {
    this.api = axios.create({
      baseURL: BASE_URL || 'http://144.22.238.109:2000',
    });
  }
}

export default new ApiConnector().api;
