import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog } from 'primereact/dialog'
import UploadSvgForm from '@/settings/UploadSvgForm';
import Icons from '../../../../backend/src/constants/svg_codes.json';

const SvgGrid = () => {
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
    return (
        <div className="card w-full h-full  bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 ">
            <Button className='shad-button_primary static float-right mb-2' onClick={() => setVisible(true)}>+ Upload Svg </Button>
            <Dialog visible={visible} onHide={() => setVisible(false)} style={{ width: '30vw', minWidth:'300px' }} header={headerTemplate} closable={false} > <UploadSvgForm setVisible={setVisible} /> </Dialog>
            <div className="w-full grid sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 text-center">
                {Object.entries(Icons).map(([svgName, svgContent]) => (
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700  cursor-pointer col-12 md:col-2 mb-5">
                        <div dangerouslySetInnerHTML={{ __html: svgContent }} className='flex justify-center text-center text-8xl mb-3 text-color-secondary ' />
                        <div>{svgName}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SvgGrid
