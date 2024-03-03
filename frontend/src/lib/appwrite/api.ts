import { INewUser } from "../types";
import Apiservices from "../api/Apiservices";
import AuthenticatedApiService from "../api/AuthenticatedApiService";
import PromiseHandler from "@/utils/PromiseHandler";

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    // async register(username: string, email: string, password: string, firstName:string, lastName:string): Promise<any> {
    const newAccount = await Apiservices.authService.register(user);
    if (!newAccount) throw Error;
    return newAccount;
  } catch (error) {
    throw new PromiseHandler('Failed to create user account', 'CREATE USER FAILED', { user });
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string , staySignedIn:string, form_type: string, verification_code:string }) {
  try {
    const session = await Apiservices.authService.login(user.email, user.password, user.staySignedIn, user.form_type, user.verification_code);
    session ? localStorage.setItem("token", session?.data?.data?.token) : '';
    return session;
  } catch (error: any) {
    return error;
    throw new PromiseHandler(error?.response?.data?.message, 'Login Failed', { user, error });
  }
}

// Reset passworx
export async function resetPassword(user: { password: string;  form_type: string, reset_token:string}) {
  try {
    const session = await Apiservices.authService.resetPassword( user.password, user.form_type, user.reset_token);
    return session;
  } catch (error: any) {
    throw new PromiseHandler(error?.response?.data?.message, 'Reset Password Failed', { user, error });
  }
}
export async function editProfile(user: { name: string;  id: string, bio:string, profile_pic?: File}) {
  try {
    const editProfileResponse = await Apiservices.authService.editProfile( user.name, user.id, user.bio, user?.profile_pic);
    console.log(editProfileResponse, "returned")
    return editProfileResponse;
  } catch (error: any) {
    throw new PromiseHandler(error?.response?.data?.message, 'Edit Profile Failed', { user, error });
  }
}
// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const currentAccount = await authenticatedApiService.getAccount();
    return currentAccount;
  } catch (error) {
    throw new PromiseHandler('Error getting user account', 'GET ACCOUNT ERROR', { error });
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const currentAccount = await authenticatedApiService.getAccount();
    return currentAccount?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting current user', 'GET_CURRENT_USER_ERROR', { error });
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    throw new PromiseHandler('Error during user sign-out', 'SIGN_OUT_ERROR', { error });
  }
}

export async function uploadMediaFile(files: File) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const newMedia = await authenticatedApiService.uploadFiles(files)
    if (!newMedia) throw Error;
    return newMedia.data;
  } catch (error) {
    throw new PromiseHandler('Failed to upload a media', 'CREATE USER FAILED', { files });
  }
}

export async function getAllMedia(page: number, limit: number): Promise<any> {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.getAllMediaFiles(page, limit);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all media files', 'Something went wrong', { error });
  }
}
export async function getAllImages(): Promise<any> {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allImages = await authenticatedApiService.getAllImageFiles();

    return allImages?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all media files', 'Something went wrong', { error });
  }
}


export async function editMedia(media: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.editMediaApi(media);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error editing this Media', 'Media Edit error', { error });
  }
}

export async function deleteMedia(media_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.deleteMediaApi(media_id);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error deleting this media', 'Delete Operation faied', { error });
  }
}


export async function getAllDomains() {
  try {
    const domains = await Apiservices.commonService.getAllDomains();
    return domains?.data;
  } catch (error) {
    throw new PromiseHandler('Error deleting this media', 'Delete Operation faied', { error });
  }
}

export async function createOrEditPost(post: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.createOrEditPost(post);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error editing this Media', 'Media Edit error', { error });
  }
}

export async function getAllPosts(page: number, limit: number, post_type: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.getAllPostApi(page, limit, post_type);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all Posts', 'Error while Fetching', { error });
  }
}

export async function getAllPostsAndPages(type: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const allMedia = await authenticatedApiService.getAllPostsAndPagesApi(type);

    return allMedia?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all Posts and Pages', 'Error while Fetching', { error });
  }
}

export async function getPostsByID(post_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.getPostByIdApi(post_id);

    return post?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting this Post', 'Post fetch error', { error });
  }
}


export async function quickEditPostById(post_id: string, postData: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.quickEditPostByIdApi(post_id, postData);

    return post?.data;
  } catch (error: any) {
    throw new PromiseHandler(error?.response?.data?.message, 'Quick Edit failed', { error });
  }
}



export async function deletePostById(post_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.deletePostByIdApi(post_id);

    return post?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting this Post', 'Post fetch error', { error });
  }
}

//Categories
export async function createOrEditCategory(category: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.createOrEditCategoryApi(category);
    return categoryData?.data;
  } catch (error) {
    throw new PromiseHandler('Error editing this Category', 'Category Edit error', { error });
  }
}

export async function getAllCategories(post_type: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.getAllCategoriesApi(post_type);
    return categoryData?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all Category', 'Category Fetch error', { error });
  }
}

export async function getCategorybyID(category_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.getCategorybyIDApi(category_id);

    return post?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting this Category', 'Category fetch error', { error });
  }
}


//Categories
export async function createOrEditCustomField(category: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.createOrEditCustomFieldApi(category);
    return categoryData?.data;
  } catch (error: any) {
    return error?.response?.data;
   
  }
}

export async function getAllCustomFields(post_type: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.getAllCustomFieldsApi(post_type);
    return categoryData?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all Category', 'Category Fetch error', { error });
  }
}

export async function getCustomFieldsbyID(custom_field_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.getCustomFieldsbyIDApi(custom_field_id);

    return post?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting this Category', 'Category fetch error', { error });
  }
}

//Categories
export async function createOrEditNavItem(category: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.createOrEditNavItemApi(category);
    return categoryData?.data;
  } catch (error) {
    throw new PromiseHandler('Error operating this Nav Item', 'Nav Item Operating error', { error });
  }
}

export async function getAllNavItems() {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const categoryData = await authenticatedApiService.getAllNavItemsApi();
    return categoryData?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting all Category', 'Category Fetch error', { error });
  }
}

export async function getNavItemsbyID(custom_field_id: string) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.getNavItemsbyIDApi(custom_field_id);

    return post?.data;
  } catch (error) {
    throw new PromiseHandler('Error getting this Category', 'Category fetch error', { error });
  }
}


export async function quickEditNavItemsbyID(category_id: string, categoryData: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.quickEditNavItemsbyIDApi(category_id, categoryData);

    return post?.data;
  } catch (error: any) {
    throw new PromiseHandler(error?.response?.data?.message, 'Quick Edit failed', { error });
  }
}

export async function saveDatatoSidebar(jsonData: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.saveDatatoSidebarApi( jsonData);

    return post?.data;
  } catch (error: any) {
    throw new PromiseHandler(error?.response?.data?.message, 'Upload failed', { error });
  }
}

export async function uploadSvg(jsonData: any) {
  try {
    const authenticatedApiService = new AuthenticatedApiService();
    const post = await authenticatedApiService.uploadSvg( jsonData);

    return post?.data;
  } catch (error: any) {
    console.log(error)
    throw new PromiseHandler(error?.response?.data?.message, 'Upload failed', { error });
  }
}