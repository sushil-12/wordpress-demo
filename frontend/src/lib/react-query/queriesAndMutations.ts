import {
    useQuery,
    useMutation,
    useQueryClient,
    UseMutationResult,
  } from "@tanstack/react-query";
  
  import {
    createUserAccount,
    signInAccount,
    getCurrentUser,
    signOutAccount,
    uploadMediaFile,
    getAllMedia,
    editMedia,
    deleteMedia,
    getAllDomains,
    getAllImages,
    createOrEditPost,
    getAllPosts,
    getPostsByID,
    deletePostById,
    quickEditPostById,
    createOrEditCategory,
    getAllCategories,
    getCategorybyID,
    getAllCustomFields,
    createOrEditCustomField,
    getCustomFieldsbyID,
    createOrEditNavItem,
    getAllNavItems,
    getNavItemsbyID,
    getAllPostsAndPages,
    quickEditNavItemsbyID,
    resetPassword,
    editProfile,
  } from "@/lib/appwrite/api";

  import {  INewUser} from "../types";
  import { QUERY_KEYS } from "./queryKeys";

  
  // ============================================================
  // AUTH QUERIES
  // ============================================================
  
  export const useCreateUserAccount = () => {
    return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user),
    });
  };
  
  export const useSignInAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string , staySignedIn: string, form_type: string, verification_code:string}) =>
        signInAccount(user),
    });
  };
  
  export const useResetPasswordAccount = () => {
    return useMutation({
      mutationFn: (user: {   password:string, form_type: string, reset_token:string}) =>
        resetPassword(user),
    });
  };
  export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount,
    });
  };
  export const useEditProfile = () => {
    return useMutation({
      mutationFn: (user: {name:string, id: string, bio:string, profile_pic?: File}) => editProfile(user),
    });
  };


  
// ============================================================
// USER QUERIES
// ============================================================
  
  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
  };


  export const useGetAllMediaFiles = (): UseMutationResult<any, unknown, { page: number; limit: number,search?:string }, unknown> => {
    return useMutation({
      mutationFn: ({ page, limit,search }) => getAllMedia(page, limit, search),
    });
  };
  export const useGetAllImages = () => {
    return useMutation({
      mutationFn: () => getAllImages(),
    });
  };
  
  export const useUploadFiles = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (files: File) => uploadMediaFile(files),  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CREATE_MEDIA_FILE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_ALL_MEDIA],
        })
      },
    });
  };


  export const useEditMedia = () => {
    return useMutation({
      mutationFn: (media: any) => editMedia(media),
    });
  };

  export const usegetPostbyID = () => {
    return useMutation({
      mutationFn: (post_id: string) => getPostsByID(post_id),
    });
  };

  export const useQuickEditPostById = (): UseMutationResult<any, unknown, { post_id: string; postData: any }> => {
    return useMutation({
      mutationFn: ({ post_id, postData }) => quickEditPostById(post_id, postData),
    });
  };
  
  export const usedeltePostbyID = () => {
    return useMutation({
      mutationFn: (post_id: string) => deletePostById(post_id),
    });
  };

  export const useGetAllDomains = () => {
    return useMutation({
      mutationFn: () => getAllDomains(),
    });
  };

  export const useDeleteMedia = () => {
    return useMutation({
      mutationFn: (media_id: string) => deleteMedia(media_id),
    });
  };

  export const useCreateOrEditPost = () => {
    return useMutation({
      mutationFn: (post: any) => createOrEditPost(post),
    });
  };

  export const useGetAllPosts = (): UseMutationResult<any, unknown, { post_type:string , page: number; limit: number, search:string }, unknown> => {
    return useMutation({
      mutationFn: ({ page, limit, post_type, search }) => getAllPosts(page, limit, post_type, search),
    });
  };

  export const useGetAllPostsAndPages = () => {
    return useMutation({
      mutationFn: (type: string) => getAllPostsAndPages(type),
    });
  };
  
  export const useCreateOrEditCategory = () => {
    return useMutation({
      mutationFn: (post: any) => createOrEditCategory(post),
    });
  };

  export const useGetAllCategories = () => {
    return useMutation({
      mutationFn: (post_type:string ) => getAllCategories(post_type),
    });
  };
  
  export const useGetCategorybyID = () => {
    return useMutation({
      mutationFn: (category_id: string) => getCategorybyID(category_id),
    });
  };


  export const usecreateOrEditCustomField = () => {
    return useMutation({
      mutationFn: (post: any) => createOrEditCustomField(post),
    });
  };

  export const useGetAllCustomFields = () => {
    return useMutation({
      mutationFn: (post_type: string) => getAllCustomFields(post_type),
    });
  };
  
  export const useGetCustomFieldsbyIDApi = () => {
    return useMutation({
      mutationFn: (category_id: string) => getCustomFieldsbyID(category_id),
    });
  };


  export const usecreateOrEditNavItem = () => {
    return useMutation({
      mutationFn: (post: any) => createOrEditNavItem(post),
    });
  };

  export const useGetAllNavItems = () => {
    return useMutation({
      mutationFn: () => getAllNavItems(),
    });
  };
  
  export const useGetNavItemsbyIDApi = () => {
    return useMutation({
      mutationFn: (category_id: string) => getNavItemsbyID(category_id),
    });
  };

  export const useQuickEditNavItemsbyIDApi = (): UseMutationResult<any, unknown, { category_id: string; categoryData: any }> => {
  
    return useMutation({
      mutationFn: ({ category_id, categoryData }) => quickEditNavItemsbyID(category_id, categoryData),
    });
  };
  