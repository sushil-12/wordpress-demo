import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { PostModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { useQuickEditPostById } from '@/lib/react-query/queriesAndMutations';
import { Badge } from '../ui/badge';
import SkeletonTable from '../skeletons/SkeletonTable';

interface PostDataTableProps {
    posts: PostModel[];
    post_type: string,
    isPostLoading: boolean
}

const PostDataTable: React.FC<PostDataTableProps> = ({ isPostLoading, posts, post_type }) => {

    const navigate = useNavigate();
    const { mutateAsync: quickEditPostById, isPending: isLoading } = useQuickEditPostById();
    type StatusType = 'published' | 'draft' | 'trash' | 'archived';
    const [statuses] = useState(['draft', 'published', 'trash', 'archived']);

    const titleTemplate = (rowData: PostModel) => {
        return <h6>{rowData.title}</h6>;
    };

    const statusBodyTemplate = (rowData: PostModel) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData)} className='px-4 py-2'></Tag>;
    };

    const categoryTemplate = (rowData: PostModel) => {
        return rowData?.categories.length > 0 ? rowData?.categories.map((item, index) => (
            <Badge key={index} className='text-slate-500 bg-black-400 border-dark-1 mx-1'>{item}</Badge>
        )) : <Badge className='text-slate-500 bg-black-400 border-dark-1 mx-1'>N/A</Badge>;
    };

    const publicationDateTemplate = (rowData: PostModel) => {
        return new Date(rowData?.publicationDate).toLocaleDateString();
    }
    const actionTemplate = (rowData: PostModel) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => navigate(`/post/${post_type}/${rowData?.id}`)}>
                    <Edit2 className='h-5' />
                </Button>
                {/* <Button className="p-1 rounded-full text-danger shadow-sm hover:text-danger focus-visible:outline " size="sm" onClick={() => navigate(`/post/${post_type}/${rowData?.id}`)}>
                    <Trash2Icon className='h-5'/>
                </Button> */}
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
        <div className="card bg-white shadow-lg rounded-md">
            {isPostLoading ? (<SkeletonTable rowCount={5} />
            ) : (
                <DataTable
                    value={posts}
                    paginator={posts.length > 10} rows={10} rowsPerPageOptions={[5, 10, 15, 20]}
                    tableStyle={{ minWidth: '60rem' }}
                    className="w-full p-8"
                >
                    <Column field="title" header="Title" body={titleTemplate} className=" font-semibold"></Column>
                    <Column field="categories" header="Categories" body={categoryTemplate} className="text-left font-semibold"></Column>
                    <Column field="publicationDate" header="Publication Date" body={publicationDateTemplate} className="text-gray-600"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} className="text-green-500"></Column>
                    <Column field="id" header="Actions" body={actionTemplate} className="text-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Edit</button>
                        {/* Add other action buttons/icons as needed */}
                    </Column>
                </DataTable>
            )
            }

        </div >
    );
};

export default PostDataTable;
