export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  checkAuthUser: () => Promise<boolean>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDomain: (newDomain: string) => Promise<void>; // Updated type to accept a string
  currentDomain: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  subcategory?:any;
};

export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  permissions: Array<string>;
};

export type INewUser = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
};

export type MediaItem = {
  id: string,
  title: string,
  tempUrl: string,
  caption: string,
  description: string,
  alt_text: string,
  filename: string,
  cloudinary_id: string,
  url: string,
  size: any,
  storage_type: string
  author: string,
  category: string,
  tags: string,
  createdAt: string,
  domain: string,
}

export type MediaItemCopy = {
  id: string,
  title: string,
  tempUrl: string,
  isLoading: boolean,
  caption: string,
  description: string,
  alt_text: string,
  filename: string,
  cloudinary_id: string,
  url: string,
  size: string,
  storage_type: string
  author: string,
  category: string,
  tags: string,
  createdAt: string,
}
export type PostModel = {
  id: string,
  title: string,
  content: string,
  author: string,
  publicationDate: Date,
  categories: string[],
  categoryObject?:any,
  tags: string[],
  featuredImage: any,
  status: string,
  // comments: [{ user: String, content: String, date: Date, default: Date.now, }, },],
  // customFields: [],
}

export type CategoryModel = {
  id: string,
  name: string,
  slug: string,
  postType: string,
  description: string,
  parentCategory: string,
}

export type CategoryKeyModel = {
  data: string,
  key: string,
  slug:string,
  label: string,
  children: any
}