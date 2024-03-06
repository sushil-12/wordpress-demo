import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import { useGetAllMediaFiles } from '@/lib/react-query/queriesAndMutations';
import MediaGrid from '@/components/shared/MediaGrid';
import { useMedia } from '@/context/MediaProvider';
import { Paginator } from 'primereact/paginator';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import MediaGridSkeletonDemo from '@/components/skeletons/MediaGridSkeletonDemo';
import { useParams } from 'react-router-dom';

export default function Media() {
  const { domain } = useParams()
  const { media: contextMedia, setMedia } = useMedia();
  const [localMedia, setLocalMedia] = useState(contextMedia);
  const { toast } = useToast();
  const { currentDomain, setCurrentDomain } = useUserContext();
  const [searchInput, setSearchInput] = useState('');
  //@ts-ignore
  setCurrentDomain(domain)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: import.meta.env.VITE_MEDIA_PAGINATION,
    totalPages: 1,
    totalItems: 0,
  });
  console.log("PAGINAATIOMN", import.meta.env.VITE_API_URL, import.meta.env.VITE_MEDIA_PAGINATION)

  const { mutateAsync: getAllMedia, isPending: isLoading } = useGetAllMediaFiles();

  useEffect(() => {
    setLocalMedia(contextMedia);
    console.log(pagination)
    currentDomain
  }, [contextMedia, currentDomain]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllMedia({ page: pagination.page, limit: pagination.limit, search: searchInput });
        setMedia(mediaResponse?.data?.mediadata);
        setPagination(mediaResponse?.data?.pagination || {});
        // return toast({ variant: "default", description: "Fetched sucessfully" })
      } catch (error) {
        return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })

      }
    };

    fetchData();
  }, [getAllMedia, setMedia, pagination.page, pagination.limit, searchInput]);

  const onPageChange = (event: any) => {
    setPagination({ ...pagination, page: event.page + 1 });
  };

  return (
    <div className="main-container px-5 w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <h3 className="page-titles">Media</h3>
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
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden px-5">
        {isLoading ? (
          <div className="w-full mx-auto  mt-[24px]"><MediaGridSkeletonDemo /></div>
        ) : (
          localMedia.length > 0 ? (
            <div className="w-full">
              <ImageUploader />
              <>
                <div className="mx-auto w-full mt-[24px]">
                  <h2 className="sr-only">Media</h2>
                  <MediaGrid media={localMedia} isLoading={isLoading} />
                </div>
                <div className="card">
                  {pagination.totalPages > 1 && <Paginator first={pagination.page} rows={pagination.limit} totalRecords={pagination.totalItems} onPageChange={onPageChange} />}
                </div>
              </>
            </div>
          ) : (
            <>
              <ImageUploader />
              <div className="text-center p-5">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No Media Exist</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new Media using dropbox above.</p>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
