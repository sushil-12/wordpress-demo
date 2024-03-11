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

interface PostDataTableProps {
    posts: PostModel[];
    post_type: string,
    isPostLoading: boolean;
    setRerender: any
}

const PostDataTable: React.FC<PostDataTableProps> = ({ isPostLoading, posts, post_type, setRerender }) => {

    const navigate = useNavigate();
    const { currentDomain } = useUserContext();
    const { toast } = useToast();
    const { mutateAsync: quickEditPostById, isPending: isLoading } = useQuickEditPostById();
    const { mutateAsync: deletePostById, isPending: isDeleting } = usedeltePostbyID();
    type StatusType = 'published' | 'draft' | 'draft' | 'draft';
    const [statuses] = useState(['draft', 'published', 'trash', 'archived']);
    const { mutateAsync: getAllCustomFields, isPending: isCustomFieldLoading } = useGetAllCustomFields();
    const [customFields, setCustomFields] = useState([]);
    const [expandedRows, setExpandedRows] = useState('');
    const [isQuickEditForm, setIsQuickEditForm] = useState(false)

    const [status, setStatus] = useState(null);

    async function fetchCustomFields() {
        const customFieldsResponse = await getAllCustomFields('page');
        console.log(customFieldsResponse?.data)
        setCustomFields(customFieldsResponse?.data?.customField)
    }

    useEffect(() => {
        fetchCustomFields();
    }, [post_type])

    const handleRowToggle = (rowData: PostModel) => {
        // Toggle expandedRow state between null and rowData.id
        console.log(expandedRows == rowData.id)
        setExpandedRows(expandedRows === rowData.id ? '' : rowData.id);
    };

    const titleTemplate = (rowData: PostModel) => {
        return <> <h6 className='text-sm'>{rowData.title} <div className={`about_section absolute w-full  ${expandedRows == rowData.id ? 'block' : 'hidden'}`}>  {rowExpansionTemplate(rowData)}</div></h6>
        </>;
    };
    const rowExpansionTemplate = (rowData: PostModel) => {
        return (
            !isQuickEditForm ? (
                <div className='flex gap-2.5 mt-1'>
                    <button className='border-none text-primary-500' onClick={() => navigate(`/${currentDomain}/post/${post_type}/${rowData?.id}`)}>Edit</button>
                    <button className='border-none text-primary-500' onClick={()=>setIsQuickEditForm(true)}>Quick edit</button>
                    <button className='border-none text-danger' onClick={() => confirmDelete(rowData.id)}>trash</button>
                    <button className='border-none text-primary-500'>View</button>
                </div>
            ) : (
                <QuickEditForm setIsQuickEditForm= {setIsQuickEditForm} />
            )
        );
    };


    const statusBodyTemplate = (rowData: PostModel) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData)} className='px-4 py-2'></Tag>;
    };

    const categoryTemplate = (rowData: PostModel) => {
        return rowData?.categories.length > 0 ? rowData?.categories.map((item, index) => (
            <Badge key={index} className='text-slate-500 bg-black-400 border-dark-1 mx-1'>{item}</Badge>
        )) : <Badge className='text-slate-500 bg-black-400 border-dark-1 mx-1'>N/A</Badge>;
    };
    async function accept(media_id: string) {
        const deleteMediaResponse = await deletePostById(media_id);
        setRerender((prev: boolean) => !prev);
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
            message: 'Do you want to delete this post?',
            header: 'Delete Confirmation',
            acceptClassName: 'pl-4 outline-none',
            rejectClassName: 'pr-4 outline-none',
            className: 'border bg-light-1 shadow-lg',
            accept: () => accept(media_id),
            reject: reject
        });
    }
    const publicationDateTemplate = (rowData: PostModel) => {
        return new Date(rowData?.publicationDate).toLocaleDateString();
    }
    const actionTemplate = (rowData: PostModel) => {
        return (
            <div className='flex gap-4'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => navigate(`/${currentDomain}/post/${post_type}/${rowData?.id}`)}>
                    <Edit2 className='h-5' />
                </Button>
                <Button className="p-1 rounded-full text-danger shadow-sm hover:text-danger focus-visible:outline " size="sm" onClick={() => confirmDelete(rowData.id)}>
                    <Trash2Icon className='h-5' />
                </Button>
            </div>
        )
    }

    const getSeverity = (data: PostModel | StatusType) => {
        const status = typeof data === 'string' ? data : data.status;

        switch (status) {
            case 'published':
                return 'success';

            case 'draft':
                return 'info';

            case 'trash':
                return 'danger';

            default:
                return null;
        }
    };

    const statusEditor = (options: any) => {
        const handleStatusChange = async (newValue: string) => {
            try {
                const updatedPost = { ...options.rowData, status: newValue };
                await quickEditPostById({ post_id: options.rowData.id, postData: updatedPost });
                options.editorCallback(newValue);
            } catch (error) {
                console.error('Error updating status:', error);
            }
        };
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                className='p-0'
                onChange={(e) => handleStatusChange(e.value)}
                placeholder="Change status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    return (
        <div className="rounded-md">
            <ConfirmDialog />
            {isPostLoading || isDeleting ? (<SkeletonTable rowCount={5} />
            ) : (
                <>
                    <DataTable
                        value={posts}
                        paginator={posts.length > 2} rows={2} rowsPerPageOptions={[5, 10, 15, 20]}
                        tableStyle={{ minWidth: '60rem' }}
                        frozenRow={true}
                        tableClassName='table-fixed '
                        rowClassName={`odd:bg-[#F6F6F6] cursor-pointer`}
                        className="w-full p-8  post_data_table table-fixed"
                        onRowClick={(e) => handleRowToggle(e.data)}
                    >

                        <Column expander={true} field="title" header="Title" body={titleTemplate} className="text-sm font-medium"></Column>
                        <Column expander={true} field="categories" header="Seo Title" body={`About the ${currentDomain}`} className="text-left text-sm font-medium"></Column>
                        <Column expander={true} field="id" header="Meta Desc" body={`Aviran Zazon: Crafting a Legacy in Tech and Beyond - Sticky ${currentDomain}`} className="text-left text-sm font-medium">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm">Edit</button>
                        </Column>



                    </DataTable>
                </>
            )
            }
           

        </div >
    );
};

export default PostDataTable;
