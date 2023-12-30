import { useRef, useState } from 'react';
import { Galleria } from 'primereact/galleria';
import { Dialog } from 'primereact/dialog';
import { LiaSpinnerSolid } from 'react-icons/lia';
import { MediaItem } from '@/lib/types';
import GalleryMediaItem from './GalleryMediaItem';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '../ui/use-toast';
import { useDeleteMedia } from '@/lib/react-query/queriesAndMutations';
import { useMedia } from '@/context/MediaProvider';
import MediaGridSkeletonDemo from '../skeletons/MediaGridSkeletonDemo';
import { Trash2Icon } from 'lucide-react';
import { bytesToSize } from '@/lib/utils';


interface MediaGridProps {
    media: MediaItem[];
    isLoading: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, isLoading }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const galleria = useRef(null);
    const { toast } = useToast();
    const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMedia();
    const { setMedia } = useMedia();

    const openEditModal = (mediaItem: MediaItem) => {
        setSelectedMedia(mediaItem);
        setVisible(true);
    };

    const onHide = () => {
        setVisible(false);
        setSelectedMedia(null);
    };

    const itemTemplate = (item: any) => {
        return (
            <GalleryMediaItem item={item}  modalVisibility = {onHide}/>
        );
    };
    async function accept(media_id: string) {
        const deleteMediaResponse = await deleteMedia(media_id);
        const updatedMedia = media.filter((item) => item.id !== media_id);
        setMedia(updatedMedia);
        if (!deleteMediaResponse) return toast({ variant: "destructive", title: "Operation cancelled", description: "You have cancelled the operations" })
        if (deleteMediaResponse?.code == 200) {
            return toast({ variant: "default", title: "Delete Media", description: deleteMediaResponse.data.message })
        } else {
            return toast({ variant: "destructive", title: "Operation cancelled", description: "You have cancelled the operations" })
        }
    }

    const reject = () => {
        return toast({ variant: "destructive", title: "Operation cancelled", description: "You have cancelled the operations" })
    }
    const confirmDelete = (media_id: string) => {
        confirmDialog({
            message: 'Do you want to delete this media file?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'pl-4 outline-none',
            rejectClassName: 'pr-4 outline-none',
            className: 'gap-4 border bg-light-1 p-6 shadow-lg',
            accept: () => accept(media_id),
            reject: reject
        });
    }

    return (
        isLoading ? (
            <MediaGridSkeletonDemo />
        ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                <ConfirmDialog />
                {media.map((mediaItem: MediaItem) => (
                    <div key={mediaItem?.id} className="group relative">
                        {mediaItem.title === 'false' && (
                             <a className="card group cursor-pointer">
                                <div className="aspect-h-1 aspect-w-1 w-full border-round border-1 surface-border p-4 surface-card overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div style={{ position: 'relative' }}>
                                        <img src={mediaItem.tempUrl} style={{ opacity: 0.2 }} />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <LiaSpinnerSolid />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )}
                        {mediaItem.title !== 'false' && (
                           <a className={`card group cursor-pointer ${isDeleting ? 'blur-lg' : ''}`}>
                            <div className="aspect-h-1 aspect-w-1 w-full border-round border-1 surface-border p-4 surface-card overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 object-contain"  onClick={() => openEditModal(mediaItem)}>
                                <img
                                    src={mediaItem.url}
                                    alt={mediaItem.alt_text}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="flex place-content-between-end mt-3" style={{"placeContent":"space-between"}}>
                                <div className="flex flex-col">
                                    <h3 className="mt-4 text-sm text-gray-700">{mediaItem.title}</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">{bytesToSize(mediaItem.size)}</p>
                                </div>
                                <Button onClick={() => confirmDelete(mediaItem.id)} icon="pi pi-times" className='outline-none' ><Trash2Icon className='text-danger outline-none'/></Button>
                            </div>
                        </a>
                        )}

                    </div>
                ))}

                {selectedMedia && (
                   <Dialog className="min-w-fit" style={{ maxWidth: "60%", width: '60%', minWidth: '600px' }} visible={visible} onHide={onHide}>
                        <Galleria
                            ref={galleria}
                            value={media}
                            numVisible={1}
                            item={itemTemplate}
                            showItemNavigators
                            circular
                            showThumbnails={false}
                            activeIndex={media.findIndex((item) => item.id === selectedMedia.id)}
                        />
                    </Dialog>
                )}
            </div>
        )
    );
};

export default MediaGrid;