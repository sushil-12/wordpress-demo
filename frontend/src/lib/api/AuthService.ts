import { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(identifier: string, password: string, staySignedIn: string, form_type: string, verification_code: string): Promise<any> {
    let data = identifier.includes('@') ? { email: identifier, password, staySignedIn, form_type, verification_code } : { username: identifier, password, staySignedIn, form_type, verification_code };
    localStorage.setItem('domain', 'he_group')
    return this.api.post('/auth/login', data);
  }
  async resetPassword(password: string, form_type: string, reset_token: string): Promise<any> {
    let data = { password, form_type , reset_token};
    return this.api.post('/auth/reset-password', data);
  }
  async editProfile(name: string, id: string, bio: string): Promise<any> {
    let data = { name, id , bio};
    return this.api.post('/auth/update-profile', data);
  }

  async register(user: object): Promise<any> {
    return this.api.post('/auth/register', user);
  }

  async logout(): Promise<any> {
    return this.api.post('/auth/logout');
  }
}

export default AuthService;