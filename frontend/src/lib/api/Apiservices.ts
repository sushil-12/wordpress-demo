import axios, { AxiosInstance } from 'axios';
import AuthService from './AuthService';

class ApiService {
  private api: AxiosInstance;
  public authService: AuthService;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://127.0.0.1:3000',
    });

    this.authService = new AuthService(this.api);
  }
}

export default new ApiService();