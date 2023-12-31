import axios, { AxiosInstance } from 'axios';
import AuthService from './AuthService';
import CommanService from './CommanService';

class ApiService {
  private api: AxiosInstance;
  public authService: AuthService;
  public commonService: CommanService;
 
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });



    this.authService = new AuthService(this.api);
    this.commonService = new CommanService(this.api);
  }
}

export default new ApiService();