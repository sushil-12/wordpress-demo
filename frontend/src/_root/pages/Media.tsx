import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import { useGetAllMediaFiles } from '@/lib/react-query/queriesAndMutations';
import MediaGrid from '@/components/shared/MediaGrid';
import { useMedia } from '@/context/MediaProvider';
import { Paginator } from 'primereact/paginator';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import MediaGridSkeletonDemo from '@/components/skeletons/MediaGridSkeletonDemo';

export default function Media() {
  const { media: contextMedia, setMedia } = useMedia();
  const [localMedia, setLocalMedia] = useState(contextMedia);
  const { toast } = useToast();
  const { currentDomain } = useUserContext();
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
        console.log("PAGINATION", pagination)
        return toast({ variant: "default", description: "Fetched sucessfully" })
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
    <div className="common-container">
      <div className="border-b border-gray-200 bg-white px-4 py-2 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Manage Media</h3>
      </div>
      {isLoading ? (
        <div className="w-full mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"><MediaGridSkeletonDemo /></div>
      ) : (
        localMedia.length > 0 ? (
          <div className="w-full">
            <ImageUploader />
            <>
              <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
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
            <div className="text-center">
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
              <ImageUploader />

            </div>
          </>
        )
      )}
    </div>
  );
}
