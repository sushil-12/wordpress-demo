import { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(identifier: string, password: string, staySignedIn:boolean): Promise<any> {
    let data = identifier.includes('@') ? {email:identifier, password, staySignedIn} :  {username:identifier, password, staySignedIn};
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