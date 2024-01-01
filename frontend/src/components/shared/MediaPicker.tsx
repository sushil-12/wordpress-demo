import  { useState } from 'react';
import ImageLibrary from './ImageLibrary';
import { Dialog } from 'primereact/dialog';
import { Image as ImageView } from 'primereact/image';
import { Card } from 'primereact/card';
import { MousePointerSquare, TrashIcon } from 'lucide-react';
import { Button } from 'primereact/button';
import { SelectIcon } from '@radix-ui/react-select';

interface MediaPickerProps {
  onSelect: (image: Image) => void;
}

interface Image {
  id: string;
  url: string;
  alt_text: string;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelect = (image: Image) => {
    setSelectedImage(image);
    onSelect(image);
    closeModal();
  };

  return (
    <div>
      <Button onClick={openModal} className='p-2'><MousePointerSquare /> Open Media Library</Button>
      {selectedImage && (
        <Card>
          <ImageView src={selectedImage.url} alt={selectedImage.alt_text} preview title='Featured Image' />
          <Button onClick={() => setSelectedImage(null)} className='p-4'><TrashIcon/> Remove Featured Image</Button>
        </Card>
      )}

      <Dialog
        className="min-w-fit bg-white dark:bg-slate-900 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl"
        style={{ maxWidth: "60%", width: '60%', minWidth: '600px' }}
        visible={isModalOpen}
        onHide={closeModal}
        header="Media Library"
      >
        <ImageLibrary onSelect={handleImageSelect} />
      </Dialog>
    </div>
  );
};

export default MediaPicker;
