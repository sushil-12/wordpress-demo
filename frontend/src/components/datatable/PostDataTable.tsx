import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { PostModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostDataTableProps {
    posts: PostModel[];
    post_type:string
}

const PostDataTable: React.FC<PostDataTableProps> = ({ posts, post_type }) => {
    const navigate = useNavigate();
    const titleTemplate = (rowData: PostModel) => {
        return <h6>{rowData.title}</h6>;
    };

    const statusBodyTemplate = (rowData: PostModel) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData)} className='px-4 py-2'></Tag>;
    };

    const publicationDateTemplate = (rowData: PostModel) => {
        return new Date(rowData?.publicationDate).toLocaleDateString();
    }
    const actionTemplate = (rowData: PostModel) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => navigate(`/post-operations/${post_type}/${rowData?.id}`)}>
                    <Edit2  className='h-5' />
                </Button>
                {/* <Button className="p-1 rounded-full text-danger shadow-sm hover:text-danger focus-visible:outline " size="sm" onClick={() => navigate(`/post-operations/${post_type}/${rowData?.id}`)}>
                    <Trash2Icon className='h-5'/>
                </Button> */}
            </div>
        )
    }

    const getSeverity = (rowData: PostModel) => {
        switch (rowData.status) {
            case 'published':
                return 'success';

            case 'draft':
                return 'warning';

            case 'trash':
                return 'danger';

            default:
                return null;
        }
    };

    // const header = (
    //     <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //         <span className="text-xl text-900 font-bold">Posts</span>
    //         {/* <Button icon="pi pi-refresh" rounded raised /> */}
    //     </div>
    // );
    // const footer = `In total there are ${posts ? posts.length : 0} posts.`;

    return (
        <div className="card bg-white shadow-lg rounded-md overflow-hidden">
            <DataTable
                value={posts}
                tableStyle={{ minWidth: '60rem'}}
                className="w-full p-8"
            >
                <Column field="title" header="Title" body={titleTemplate} className=" font-semibold"></Column>
                <Column field="publicationDate" header="Publication Date" body={publicationDateTemplate} className="text-gray-600"></Column>
                <Column field="status" header="Status" body={statusBodyTemplate} className="text-green-500"></Column>
                <Column field="id" header="Actions" body={actionTemplate} className="text-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Edit</button>
                    {/* Add other action buttons/icons as needed */}
                </Column>
            </DataTable>
        </div>
    );
};

export default PostDataTable;
