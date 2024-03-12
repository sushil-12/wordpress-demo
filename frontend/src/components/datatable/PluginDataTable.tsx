import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { PostModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useGetAllCustomFields, useQuickEditPostById, usedeltePostbyID } from '@/lib/react-query/queriesAndMutations';
import { Badge } from '../ui/badge';
import SkeletonTable from '../skeletons/SkeletonTable';
import { useToast } from '../ui/use-toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUserContext } from '@/context/AuthProvider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostFormSchema, quickEditFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import QuickEditForm from '@/plugin/post/_custom_form/QuickEditForm';
import SvgComponent from '@/utils/SvgComponent';

interface PluginDataTable {
    plugins: any;
    domain: string,
}

const PluginDataTable: React.FC<PluginDataTable> = ({ plugins, domain }) => {

    const navigate = useNavigate();
    const { currentDomain } = useUserContext();

    const titleTemplate = (rowData: any) => {
        return (
            <>
                <h6 className='text-sm'>
                    {rowData.title}
                </h6>
            </>
        );
    };
    const descTemplate = (rowData: any) => {
        return (
            <>
                <h6 className='text-sm'>
                    {rowData?.description}
                </h6>
            </>
        );
    };
    const actionTemplate = (rowData: any) => {
        return (
            <>
                <button className="bg-primary-500 rounded-md text-white py-2 px-4" onClick={() => navigate(`/${domain}/manage-custom-fields`)}>
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='settings' />
                       <span className='text-xs'> Settings</span>
                    </div>
                </button>
            </>
        );
    };



    return (
        <div className="rounded-md">
            <ConfirmDialog />
            <>
                <DataTable
                    value={plugins}
                    paginator={plugins.length > 10} rows={10} rowsPerPageOptions={[5, 10, 15, 20]}
                    tableStyle={{ minWidth: '60rem' }}
                    frozenRow={true}
                    tableClassName='table-fixed rounded '
                    rowClassName={`odd:bg-[#F6F6F6] cursor-pointer`}
                    pt={{
                        headerRow: { className: 'hidden' }
                    }}
                    header={false}
                    className="w-full post_data_table table-fixed"
                >

                    <Column expander={true} field="title" header="Title" body={titleTemplate} className="text-sm font-medium"></Column>
                    <Column expander={true} field="categories" header="Description" body={descTemplate} className="text-left text-sm font-medium"></Column>
                    <Column expander={true} field="id" header="Actions" body={actionTemplate} className="text-right"></Column>
                </DataTable>
            </>
        </div >
    );
};

export default PluginDataTable;
