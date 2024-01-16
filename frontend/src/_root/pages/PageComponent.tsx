import PostDataTable from '@/components/datatable/PostDataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPosts } from '@/lib/react-query/queriesAndMutations';
import { PlusSquare, Router } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const PageComponent = () => {
  const post_type = 'page';
  const defaultPostType = post_type;
  const [render, setRerender] = useState(true);
  const [posts, setPost] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    totalItems: 0,
  });
  const { mutateAsync: getAllPosts, isPending: isLoading } = useGetAllPosts();
  const fetchPosts = async () => {
    try {
      const postResponse = await getAllPosts({ page: pagination.page, limit: pagination.limit, post_type: defaultPostType });
      setPost(postResponse?.data?.posts);
      setPagination(postResponse?.data?.pagination || {});
    } catch (error) {
      return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })

    }
  };
  useEffect(() => {
    fetchPosts();
  }, [setPost, post_type]);
  return (
    <div className="common-container">
      <div className="border-b border-gray-200 bg-white  py-2 flex justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3"> <Router />{(post_type?.toUpperCase())}S</h3>
        <Button className="shad-button_primary place-self-end" size="sm" onClick={() => navigate(`/post/${post_type}`)}>
          <PlusSquare /> Add New
        </Button>
      </div>
      <PostDataTable posts={posts} post_type={defaultPostType} isPostLoading={isLoading} setRerender={setRerender} />
    </div>
  )
}

export default PageComponent
