import PostDataTable from '@/components/datatable/PostDataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPosts } from '@/lib/react-query/queriesAndMutations';
import { PlusSquare, Router } from 'lucide-react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';

const Technology = () => {
    const [posts, setPost] = useState([]);
    const {toast}  = useToast();
    const post_type='technology';
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalItems: 0,
      });
    const {mutateAsync: getAllPosts, isPending: isLoading} = useGetAllPosts();
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const postResponse = await getAllPosts({  page: pagination.page, limit: pagination.limit, post_type });
            setPost(postResponse?.data?.posts);
            setPagination(postResponse?.data?.pagination || {});
          } catch (error) {
            return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })
    
          }
        };
    
        fetchPosts();
      }, [getAllPosts, setPost, pagination.page, pagination.limit]);
  return (
    <div className="common-container">
         <div className="border-b border-gray-200 bg-white  py-2 flex justify-between">
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3"> <Router />Technologies</h3>
                <Button className="shad-button_primary place-self-end" size="sm" onClick={() => navigate(`/post-operations/technology`)}>
                    <PlusSquare /> Add New
                </Button>
            </div>
      <PostDataTable posts = {posts} />
    </div>
  )
}

export default Technology
