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

  async uploadFiles(files: File): Promise<any> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const formData = new FormData();
    formData.append('file', files);
    const config: AxiosRequestConfig = { headers };
    return await this.api.post('/api/media/upload', formData, config);
  }

  async getAllMediaFiles(page: number, limit: number): Promise<any> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const config: AxiosRequestConfig = { headers, params: { page, limit } };
    return await this.api.get('/api/media/all', config);
  }

  async editMediaApi(media:any): Promise<any> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const config: AxiosRequestConfig = { headers };
    return await this.api.put('/api/edit/media', media, config);
  }

  async deleteMediaApi(media_id:string): Promise<any> {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const config: AxiosRequestConfig = { headers };
    return await this.api.delete('/api/delete/media/'+media_id, config);
  }
  
  
}

export default AuthenticatedApiService;
