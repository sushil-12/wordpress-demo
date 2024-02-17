import { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(identifier: string, password: string, staySignedIn:string, form_type:string, verification_code:string): Promise<any> {
    let data = identifier.includes('@') ? {email:identifier, password, staySignedIn, form_type ,verification_code } :  {username:identifier, password, staySignedIn, form_type, verification_code };
    sessionStorage.setItem('domain', 'he_group')
    return this.api.post('/auth/login',data);
  }

  async register(user:object): Promise<any> {
    return this.api.post('/auth/register', user);
  }

  async logout(): Promise<any> {
    return this.api.post('/auth/logout');
  }
}

export default AuthService;