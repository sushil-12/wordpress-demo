import axios, { AxiosInstance } from 'axios';
import AuthService from './AuthService';

class ApiService {
  private api: AxiosInstance;
  public authService: AuthService;
 
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });


    this.authService = new AuthService(this.api);
  }
}

export default new ApiService();