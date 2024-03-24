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
        <div className="max-h-[630px] grow-0 flex flex-col md:flex-row gap-6 ">
            <div className="w-[688px]">
                <div className="w-full h-full rounded overflow-hidden max-w-full max-h-full">
                    <img src={currentItem?.url} alt={currentItem?.alt_text} className="object-cover w-full h-full" />
                </div>
            </div>
            <div className="w-1/4 md:w-auto h-full ">
                <MediaEditForm item={currentItem} handleModal={modalVisibility} />
            </div>
        </div>
    );
};

export default GalleryMediaItem;