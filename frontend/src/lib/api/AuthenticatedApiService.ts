import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class AuthenticatedApiService {
  private token: string | null;
  private api: AxiosInstance;
  private domain: string | null;

  constructor() {
    this.token = localStorage.getItem("token");
    this.domain = localStorage.getItem("domain");
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

  async checkPassword(password: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/check-password', { password: password }, config);
  }

  async sendOtpForVerification(email: string, form_type: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    if (form_type == 'send_mail') {
      return await this.api.post('/api/verify-email', { email: email, form_type: form_type }, config);
    } else {
      return await this.api.post('/api/verify-email', { verification_code: email, form_type: form_type }, config);

    }
  }

  async uploadFiles(files: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', files);
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/media/upload', formData, config);
  }

  async getAllMediaFiles(page: number, limit: number, search?: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders(), params: { page, limit, search } };
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

  async createOrEditPost(post: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/create-or-update/post', post, config);
  }

  async getAllPostApi(page: number, limit: number, post_type: string, search: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders(), params: { page, limit, search } };
    return await this.api.get('/api/get-all-post/' + post_type, config);
  }

  async getAllPostsAndPagesApi(type: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-all-post-and-pages/' + type, config);
  }


  async getPostByIdApi(post_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-post/' + post_id, config);
  }

  async quickEditPostByIdApi(post_id: string, postData: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.patch('/api/quick-edit-post/' + post_id, postData, config);
  }


  async deletePostByIdApi(post_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.delete('/api/delete-post/' + post_id, config);
  }

  // Categories
  async createOrEditCategoryApi(category: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/create-or-update/categories', category, config);
  }

  async getAllCategoriesApi(post_type: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-all-categories/' + post_type, config);
  }
  async getCategorybyIDApi(category_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-category/' + category_id, config);
  }

  async createOrEditCustomFieldApi(post: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/create-or-update/custom-fields', post, config);
  }
  async getAllCustomFieldsApi(post_type: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-all-custom-fields/' + post_type, config);
  }
  async getCustomFieldsbyIDApi(custom_field_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/get-custom-field/' + custom_field_id, config);
  }

  async createOrEditNavItemApi(post: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.post('/api/common/create-or-edit/navigation-items', post, config);
  }
  async getAllNavItemsApi(): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/common/navigation-items', config);
  }
  async getNavItemsbyIDApi(custom_field_id: string): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.get('/api/common/navigation-items' + custom_field_id, config);
  }

  async quickEditNavItemsbyIDApi(post_id: string, postData: any): Promise<any> {
    const config: AxiosRequestConfig = { headers: this.getHeaders() };
    return await this.api.patch('/api/common/navigation-item-quick-edit/' + post_id, postData, config);
  }

  async saveDatatoSidebarApi(jsonData: any): Promise<any> {
    return await this.api.post('/writefile', jsonData);
  }
  async uploadSvg(jsonData: any): Promise<any> {
    return await this.api.post('/upload/svg', jsonData);
  }

}

export default AuthenticatedApiService;
