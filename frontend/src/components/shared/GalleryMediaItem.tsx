import MediaEditForm from '@/_auth/Forms/MediaEditForm';
import { MediaItem } from '@/lib/types';
import { Image } from 'primereact/image';
import { useEffect, useState } from 'react';

const GalleryMediaItem: React.FC<{ item: MediaItem, modalVisibility: any }> = ({ item, modalVisibility }) => {
    const [currentItem, setCurrentItem] = useState<MediaItem>(item);
    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    return (
        <div className="flex flex-wrap min-h-[662px] max-h-[662px] gap-6">
            <div className="w-[688px] min-h-[556px] max-h-[556px] ">
                <div className="h-full w-full">
                    <div className=" w-full max-h-[556px] rounded   ">
                        <Image src={currentItem?.url} alt={currentItem?.alt_text} className="align-items-center" preview data-pr-tooltip='p-image-toolbar' />
                    </div>
                </div>
            </div>
            <div className=" mr-auto h-full px-4">
                <MediaEditForm item={currentItem} handleModal={modalVisibility} />
            </div>
        </div>

    );
};

export default GalleryMediaItem;