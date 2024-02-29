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
  //@ts-ignore
  setCurrentDomain(domain)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    totalItems: 0,
  });

  const { mutateAsync: getAllMedia, isPending: isLoading } = useGetAllMediaFiles();

  useEffect(() => {
    setLocalMedia(contextMedia);
    currentDomain
  }, [contextMedia, currentDomain]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllMedia({ page: pagination.page, limit: pagination.limit });
        setMedia(mediaResponse?.data?.mediadata);
        setPagination(mediaResponse?.data?.pagination || {});
        // return toast({ variant: "default", description: "Fetched sucessfully" })
      } catch (error) {
        return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })

      }
    };

    fetchData();
  }, [getAllMedia, setMedia, pagination.page, pagination.limit]);

  const onPageChange = (event: any) => {
    setPagination({ ...pagination, page: event.page + 1 });
  };

  return (
    <div className="main-container px-5 w-full overflow-y-hidden ">
      <div className="px-4 pt-5 pb-[38px] flex justify-between h-[10vh] min-h-[10vh] max-h-[10vh">
        <h3 className="page-titles">Media</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-5 ">
        {isLoading ? (
          <div className="w-full mx-auto  mt-[15px]"><MediaGridSkeletonDemo /></div>
        ) : (
          localMedia.length > 0 ? (
            <div className="w-full">
              <ImageUploader />
              <>
                <div className="mx-auto w-full mt-[15px]">
                  <h2 className="sr-only">Media</h2>
                  <MediaGrid media={localMedia} isLoading={isLoading} />
                </div>
                <div className="card">
                  {localMedia.length > 50 && <Paginator first={pagination.page} rows={pagination.limit} totalRecords={pagination.totalItems} onPageChange={onPageChange} />}
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
