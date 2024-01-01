import MediaEditForm from '@/_auth/Forms/MediaEditForm';
import { MediaItem } from '@/lib/types';
import { Image } from 'primereact/image';
import { useEffect, useState } from 'react';

const GalleryMediaItem: React.FC<{ item: MediaItem, modalVisibility:any }> = ({ item, modalVisibility }) => {
    const [currentItem, setCurrentItem] = useState<MediaItem>(item);
    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    return (
        <div className="flex flex-wrap items-center size-40  min-w-fit h-auto p-4">
            <div className="w-1/2 ml-auto h-full">
                <div className="w-full p-12 box-border h-auto  border-4">
                <div className="mx-auto rounded w-100 h-auto max-w-40  text-white flex items-center justify-center">
                        <Image src={currentItem?.url} alt={currentItem?.alt_text} className="align-items-center" preview data-pr-tooltip='p-image-toolbar'/>
                    </div>
                </div>
            </div>
            <div className="w-1/2 mr-auto h-full px-4">
                <MediaEditForm item={currentItem} handleModal={modalVisibility} />
            </div>
        </div>
    );
};

export default GalleryMediaItem;