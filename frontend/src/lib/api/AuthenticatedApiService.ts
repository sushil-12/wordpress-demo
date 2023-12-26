import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class AuthenticatedApiService {
  private token: string | null;
  private api: AxiosInstance;

  constructor() {
    this.token = sessionStorage.getItem("token");
    console.log("TOKEN", this.token)
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
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


