import React, { useState } from 'react';
import Icons from '../../../../backend/src/constants/svg_codes.json';
import { Dialog } from 'primereact/dialog';
import { Button } from '../ui/button';
import UploadSvgForm from '@/settings/UploadSvgForm';

// @ts-ignore
const SvgPickerComponent = ({ setSvgName }) => {
    const [activeCard, setActiveCard] = useState('');
    const [visible, setVisible] = useState(false);
    console.log(Icons, "ICONS")

    const headerTemplate = (item: any) => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Attachment Details</h1>
                <button onClick={() => setVisible(false)}><img src='/assets/icons/close.svg' className='cursor-pointer' /></button>
            </div>
        );
    };
    const handleDoubleClick = (svgName: any) => {
        setSvgName(svgName);
        setActiveCard(svgName)
    };

    return (
        <div className="w-full h-full rounded-lg sm:p-6 dark:bg-gray-800 dark:border-gray-700">
            <Button className='shad-button_primary absolute top-5 right-16 float-right mb-2' onClick={() => setVisible(true)}>+ Add new</Button>
            <div className="w-full grid grid-cols-6 sm:grid-cols-5 gap-4 text-center relative">
                <Dialog visible={visible} onHide={() => setVisible(false)} style={{ width: '30vw' }} header={headerTemplate} closable={false} > <UploadSvgForm setVisible={setVisible} /> </Dialog>
                {Object.entries(Icons).map(([svgName, svgContent]) => (
                    <div
                        key={svgName}
                        className={`block max-w-sm p-6  border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer col-12 md:col-2 mb-5 ${activeCard == svgName ? 'bg-primary-500 text-white' : ''}`}
                        onDoubleClick={() => handleDoubleClick(svgName)}
                    >
                        <div dangerouslySetInnerHTML={{ __html: svgContent }} className='flex justify-center text-center text-8xl mb-3 text-color-secondary' />
                        <div>{svgName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SvgPickerComponent;