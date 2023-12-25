import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class CustomError extends Error {
  constructor(name: string, message: string, public originalError?: any) {
    super(message);
    this.name = name;
  }
}
class AuthenticatedApiService {
  private token: string | null;
  private api: AxiosInstance;

  constructor() {
    this.token = sessionStorage.getItem("token");
    this.api = axios.create({
      baseURL: 'http://127.0.0.1:3000',
    });
  }


  async getAccount(): Promise<any> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const config: AxiosRequestConfig = { headers };
    return await this.api.get('/api/profile', config);
  }

  // Add more methods for other authenticated endpoints or functionalities
}

export default AuthenticatedApiService;


