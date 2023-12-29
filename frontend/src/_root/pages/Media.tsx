import  { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import {  useGetAllMediaFiles } from '@/lib/react-query/queriesAndMutations';
import MediaGrid from '@/components/shared/MediaGrid';
import { useMedia } from '@/context/MediaProvider';
import { Paginator } from 'primereact/paginator';
import { useToast } from '@/components/ui/use-toast';

export default function Media() {
  const { media: contextMedia, setMedia } = useMedia();
  const [localMedia, setLocalMedia] = useState(contextMedia);
  const {toast} = useToast();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    totalItems: 0,
  });

  const { mutateAsync: getAllMedia, isPending: isLoading } = useGetAllMediaFiles();

  useEffect(() => {
    setLocalMedia(contextMedia);
  }, [contextMedia]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllMedia({ page: pagination.page, limit: pagination.limit });
        setMedia(mediaResponse?.data?.mediadata);
        setPagination(mediaResponse?.data?.pagination || {});
        console.log("PAGINATION", pagination)
        return toast({ variant: "default", title: "Media Items", description: "Fetched sucessfully" })
      } catch (error) {
        return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })

      }
    };

    fetchData();
  }, [getAllMedia, setMedia, pagination.page, pagination.limit]);

  const onPageChange = (event:any) => {
    setPagination({ ...pagination, page: event.page + 1 }); 
  };

  return (
    <div className="common-container">
      <div className="w-full">
        <ImageUploader />
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Media</h2>
          <MediaGrid media={localMedia} isLoading={isLoading} />
        </div>
        <div className="card">
          <Paginator first={pagination.page} rows={pagination.limit} totalRecords={pagination.totalItems}  onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}
