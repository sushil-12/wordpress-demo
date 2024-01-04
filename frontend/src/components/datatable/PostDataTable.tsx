import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { PostModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostDataTableProps {
    posts: PostModel[];
}

const PostDataTable: React.FC<PostDataTableProps> = ({ posts }) => {
    const [currentPost, setCurrentPosts] = useState<PostModel[]>([]);
    const navigate = useNavigate();

    console.log(posts);
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
        return (<Button className="shad-button_primary place-self-end" size="sm" onClick={() => navigate(`/post-operations/technology/${rowData?._id}`)}>
            <Edit2 />
        </Button>)
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

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Posts</span>
            {/* <Button icon="pi pi-refresh" rounded raised /> */}
        </div>
    );
    const footer = `In total there are ${currentPost ? currentPost.length : 0} posts.`;

    return (
        <div className="card">
            <DataTable value={posts} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                {/* Replace 'name', 'price', and 'category' with actual properties of PostModel */}
                <Column field="title" header="Title" body={titleTemplate}></Column>
                {/* <Column header="Image" body={(rowData) => <img src={rowData.image} alt={rowData.name} className="w-6rem shadow-2 border-round" />} /> */}
                {/* <Column field="price" header="Price"></Column> */}
                <Column field="publicationDate" header="Publication Date" body={publicationDateTemplate}></Column>
                {/* <Column field="rating" header="Reviews" body={titleTemplate}></Column> */}
                <Column header="Status" body={statusBodyTemplate}></Column>
                <Column field="id" header="Actions" body={actionTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default PostDataTable;
