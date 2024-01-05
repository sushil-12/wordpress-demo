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
      mutationFn: (user: { email: string; password: string }) =>
        signInAccount(user),
    });
  };
  
  export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount,
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


  export const useGetAllMediaFiles = (): UseMutationResult<any, unknown, { page: number; limit: number }, unknown> => {
    return useMutation({
      mutationFn: ({ page, limit }) => getAllMedia(page, limit),
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

  export const useGetAllPosts = (): UseMutationResult<any, unknown, { post_type:string , page: number; limit: number }, unknown> => {
    return useMutation({
      mutationFn: ({ page, limit, post_type }) => getAllPosts(page, limit, post_type),
    });
  };
  
