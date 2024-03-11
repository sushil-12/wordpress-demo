import PostDataTable from '@/components/datatable/PostDataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import { useGetAllPosts } from '@/lib/react-query/queriesAndMutations';
import SvgComponent from '@/utils/SvgComponent';
import { PlusSquare, Router } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const PageComponent = () => {
  const post_type = 'page';
  const { domain } = useParams();
  const { setCurrentDomain, currentDomain } = useUserContext();
  // @ts-ignore
  setCurrentDomain(domain)
  const defaultPostType = post_type;
  const [render, setRerender] = useState(true);
  const [posts, setPost] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

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
    <div className="main-container px-5 w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <div className="flex gap-[15px]">
          <h3 className="page-titles capitalize">{(post_type + 's')}</h3>
          <Button className="shad-button_primary place-self-end" size="sm" onClick={() => navigate(`${currentDomain}/post/${post_type}`)}>
            <SvgComponent className='' svgName='plus-circle' /> Add {post_type}
          </Button>
        </div>

        <div className="flex justify-start items-center py-7 relative">
          <input
            onChange={() => setSearchInput(event?.target.value)}
            value={searchInput}
            className="leading-none text-left text-gray-600 px-4 py-3 border rounded border-gray-300 outline-none w-[239px] h-10 text-[14px] font-medium hover:rounded-[50px] "
            type="text"
            placeholder="Search"
          />
          <svg className="absolute right-3 z-10 cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z" fill="#4F5B67" />
          </svg>

        </div>
      </div>
      <PostDataTable posts={posts} post_type={defaultPostType} isPostLoading={isLoading} setRerender={setRerender} />
    </div>
  )
}

export default PageComponent
