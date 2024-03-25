import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PostModel } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {  usedeltePostbyID } from '@/lib/react-query/queriesAndMutations';
import SkeletonTable from '../skeletons/SkeletonTable';
import { useToast } from '../ui/use-toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUserContext } from '@/context/AuthProvider';

import QuickEditForm from '@/plugin/post/_custom_form/QuickEditForm';

interface PostDataTableProps {
    posts: PostModel[];
    post_type: string,
    isPostLoading: boolean;
    setRerender: any
    render: boolean
}

const PostDataTable: React.FC<PostDataTableProps> = ({ isPostLoading, posts, post_type, setRerender, render }) => {

    const navigate = useNavigate();
    const { currentDomain } = useUserContext();
    const { toast } = useToast();
    const { mutateAsync: deletePostById, isPending: isDeleting } = usedeltePostbyID();
    // type StatusType = 'published' | 'draft' | 'draft' | 'draft';
    // const [statuses] = useState(['draft', 'published', 'trash', 'archived']);
    // const { mutateAsync: getAllCustomFields, isPending: isCustomFieldLoading } = useGetAllCustomFields();
    // const [customFields, setCustomFields] = useState([]);
    // console.log(isCustomFieldLoading, customFields)
    const [expandedRows, setExpandedRows] = useState('');
    const [expandedQuickEditRows, setExpandedQuickEditRows] = useState('');
    const [isQuickEditForm, setIsQuickEditForm] = useState(false)
    const [rerenderPostTable, setRerenderPostTable] = useState(false)


    // async function fetchCustomFields() {
    //     const customFieldsResponse = await getAllCustomFields('page');
    //     console.log(customFieldsResponse?.data)
    //     setCustomFields(customFieldsResponse?.data?.customField)
    // }

    useEffect(() => {
        // fetchCustomFields();
        if (expandedRows) {
            setIsQuickEditForm(false);
        }
        setRerender(!render);
    }, [post_type, rerenderPostTable])

    const handleRowToggle = (rowData: PostModel) => {
        // Toggle expandedRow state between null and rowData.id
        console.log(expandedRows == rowData.id)
        setExpandedRows(expandedRows === rowData.id ? (rowData.id) : (setIsQuickEditForm(false), rowData.id));
    };

    const titleTemplate = (rowData: PostModel) => {
        return (
            <>
                <h6 className='text-sm'>
                    {rowData.title}
                    <div className={`about_section relative w-full ${expandedRows == rowData.id || expandedQuickEditRows == rowData.id ? 'block' : 'hidden'}`}>
                        <table className='w-[100vw]'>
                            <tbody>
                                <tr>
                                    <td colSpan={100}>{rowExpansionTemplate(rowData)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </h6>
            </>
        );
    };

    const rowExpansionTemplate = (rowData: PostModel) => {
        console.log(!isQuickEditForm || (expandedQuickEditRows && expandedQuickEditRows === rowData.id));

        let showQuickEditForm = isQuickEditForm || expandedQuickEditRows == rowData.id
        console.log("SHOW", showQuickEditForm)
        return (
            (!showQuickEditForm) ? (
                <div className='flex gap-2.5 mt-1'>
                    <button className='border-none text-primary-500' onClick={() => navigate(`/${currentDomain}/post/${post_type}/${rowData?.id}`)}>Edit</button>
                    <button className='border-none text-primary-500' onClick={() => { setIsQuickEditForm(true); setExpandedQuickEditRows(rowData.id) }}>Quick   edit</button>
                    <button className='border-none text-danger' onClick={() => confirmDelete(rowData.id)}>Trash</button>
                    <button className='border-none text-primary-500'>View</button>
                </div>
            ) : (
                <QuickEditForm setIsQuickEditForm={setIsQuickEditForm} rowData={rowData} setRerender={setRerenderPostTable} rerenderPostTable={rerenderPostTable} post_type={post_type} setExpandedQuickEditRows={setExpandedQuickEditRows} />
            )
        );
    };


    async function accept(media_id: string) {
        const deleteMediaResponse = await deletePostById(media_id);
        setRerender(!render);
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

    return (
        <div className="rounded-[1px] overflow-x-hidden w-full">
            <ConfirmDialog />
            {isPostLoading || isDeleting ? (<SkeletonTable rowCount={5} />
            ) : (
                <>
                    <DataTable
                        value={posts}
                        paginator={posts.length > import.meta.env.VITE_POST_PAGINATION} rows={import.meta.env.VITE_POST_PAGINATION} rowsPerPageOptions={[5, 10, 15, 20]}
                        tableStyle={{ minWidth: '60rem' }}
                        frozenRow={true}
                        tableClassName='table-fixed rounded-sm overflow-x-hidden' // @ts-ignore
                        rowClassName={`odd:bg-[#F6F6F6] cursor-pointer`} // @ts-ignore
                        className="post_data_table table-fixed overflow-x-hidden" // @ts-ignore
                        onRowMouseEnter={(e) => { handleRowToggle(e.data); }}
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
