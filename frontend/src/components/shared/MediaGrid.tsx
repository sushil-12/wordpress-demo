import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { MediaItem } from '@/lib/types';
import GalleryMediaItem from './GalleryMediaItem';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '../ui/use-toast';
import { useDeleteMedia } from '@/lib/react-query/queriesAndMutations';
import { useMedia } from '@/context/MediaProvider';
import { bytesToSize } from '@/lib/utils';
import { Skeleton } from 'primereact/skeleton';
import SvgComponent from '@/utils/SvgComponent';


interface MediaGridProps {
    media: MediaItem[];
    isLoading: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, isLoading }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const { toast } = useToast();
    const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMedia();
    const { setMedia } = useMedia();
    console.log(isLoading);
    
    const openEditModal = (mediaItem: MediaItem) => {
        setSelectedMedia(mediaItem);
        setVisible(true);
    };

    const onHide = () => {
        setVisible(false);
        setSelectedMedia(null);
    };


    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Attachment Details</h1>
                <button onClick={()=> setVisible(false)}><img src='/assets/icons/close.svg'className='cursor-pointer' /></button>
            </div>
        );
    };

    async function accept(media_id: string) {
        const deleteMediaResponse = await deleteMedia(media_id);
        const updatedMedia = media.filter((item) => item.id !== media_id);
        setMedia(updatedMedia);
        if (!deleteMediaResponse) return toast({ variant: "destructive", description: "You have cancelled the operations" })
        if (deleteMediaResponse?.code == 200) {
            return toast({ variant: "default", description: deleteMediaResponse.data.message })
        } else {
            return toast({ variant: "destructive", description: "You have cancelled the operations" })
        }
    }

    const reject = () => {
        return toast({ variant: "destructive", description: "You have cancelled the operations" })
    }
    const confirmDelete = (media_id: string) => {
        confirmDialog({
            message: 'Do you want to delete this media file?',
            header: 'Delete Confirmation',
            acceptClassName: 'pl-4 outline-none p-2 text-sm',
            rejectClassName: 'pl-4 outline-none p-2 text-sm text-white',
            className: 'border bg-light-1 shadow-lg p-0',
            accept: () => accept(media_id),
            reject: reject,
            draggable: false,
        });
    }

    return (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 xl:gap-x-8 mb-4">
            <ConfirmDialog />
            {media.map((mediaItem: MediaItem) => (
                //
                <div key={mediaItem?.id} className="group relative">
                    {mediaItem.title === 'false' && (
                        <a className="card group cursor-pointer">
                            <div className="aspect-h-1 aspect-w-1 w-full border-round border-1 surface-border surface-card overflow-hidden xl:aspect-h-8 xl:aspect-w-7 object-contain ">
                                <div style={{ position: 'relative' }} className='w-full h-[201px]'>
                                    <img src={mediaItem.tempUrl} style={{ opacity: 0.2 }} className="h-full w-full object-contain object-center group-hover:opacity-75" />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                </div>
                                <div className="flex place-content-between-end mt-[9px]  max-w-[360px]" style={{ "placeContent": "space-between" }}>
                                    <div className="flex flex-col">
                                        <Skeleton height='20px' width='100px' />
                                    </div>
                                    <Skeleton height='18px' width='18px' />
                                </div>
                            </div>
                        </a>
                    )}
                    {mediaItem.title !== 'false' && (
                        <a className={`card group cursor-pointer  ${isDeleting ? 'blur-sm' : ''}`} >
                            <div className="aspect-h-1 aspect-w-1 w-full border-round border-1 surface-border surface-card overflow-hidden xl:aspect-h-8 xl:aspect-w-7  min-h-[201px] max-h-[201px] object-contain " onClick={() => openEditModal(mediaItem)}>
                                <img
                                    src={mediaItem.url}
                                    alt={mediaItem.alt_text}
                                    className="h-full w-full object-contain object-center items-center self-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="flex place-content-between-end mt-[9px] " style={{ "placeContent": "space-between" }}>
                                <div className="flex flex-col">
                                    <h3 className="mt-4 text-[16px] leading-[150%] text-[#242D35] page-innersubtitles">{mediaItem.title}</h3>
                                    <p className="mt-1 text-xl font-semibold text-gray-900">{bytesToSize(mediaItem.size)}</p>
                                </div>
                                <Button onClick={() => confirmDelete(mediaItem.id)} className='outline-none p-0 bg-transparent border-none' >
                                   <SvgComponent className='' svgName='delete' />
                                </Button>
                            </div>
                        </a>
                    )}

                </div>
            ))}
            {selectedMedia && (
                <Dialog
                    draggable={false}
                    header={headerTemplate}
                    closeIcon={`hidden`}
                    closable={false}
                    pt={{
                        root: { className: 'bg-white-100 overflow-hidden' },
                        headerTitle: { className: 'page-subtitles' },
                        content:{className: 'overflow-y-auto p-6 pt-0'}
                    }}
                    style={{ width:'1110px' , height:'auto'}}
                    visible={visible} onHide={onHide}>
                     <GalleryMediaItem item={selectedMedia} modalVisibility={onHide} />
                </Dialog>
            )}
        </div>
    );
};

export default MediaGrid;