import MediaEditForm from '@/_auth/Forms/MediaEditForm';
import { MediaItem } from '@/lib/types';
import { Image } from 'primereact/image';
import { useEffect, useState } from 'react';

const GalleryMediaItem: React.FC<{ item: MediaItem }> = ({ item }) => {
    const [currentItem, setCurrentItem] = useState<MediaItem>(item);
    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    return (
        <div className="flex flex-wrap items-center w-full p-4">
            <div className="w-1/2 ml-auto h-full">
                <div className="w-full p-12">
                <div className="mx-auto rounded w-100 h-16 max-w-40  text-white flex items-center justify-center">
                        <Image src={currentItem?.url} alt={currentItem?.alt_text} className="align-items-center" preview />
                    </div>
                </div>
            </div>
            <div className="w-1/2 mr-auto h-full px-4">
                <MediaEditForm item={currentItem} />
            </div>
        </div>
    );
};

export default GalleryMediaItem;