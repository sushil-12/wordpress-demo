import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class AuthenticatedApiService {
  private token: string | null;
  private api: AxiosInstance;
  private domain: string | null;

  constructor() {
    this.token = sessionStorage.getItem("token");
    this.domain = sessionStorage.getItem("domain");
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    if (this.domain) {
      headers['Domain'] = this.domain;
    }
    return headers;
  }

  async getAccount(): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/profile', config);
  }

  async uploadFiles(files: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', files);
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/media/upload', formData, config);
  }

  async getAllMediaFiles(page: number, limit: number): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders(), params: { page, limit } };
    return await this.api.get('/api/media/all', config);
  }

  async getAllImageFiles(): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/images/all', config);
  }

  async editMediaApi(media: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.put('/api/edit/media', media, config);
  }

  async deleteMediaApi(media_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.delete('/api/delete/media/' + media_id, config);
  }
}

export default AuthenticatedApiService;
