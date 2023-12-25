export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUser = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role:string;
    permissions:Array<string>;
  };
  
  export type INewUser = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
  };