import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { CategoryKeyModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { TreeTable } from 'primereact/treetable';
import { useCategory } from '@/plugin/category/CategoryContext';
import { useGetCategorybyID } from '@/lib/react-query/queriesAndMutations';


const CategoryDataTable = () => {
    const { categories, setCategories, selectedCategory, setSelectedCategory } = useCategory();
    const { mutateAsync: getCategoryById, isPending: isLoading } = useGetCategorybyID();
    const titleTemplate = (rowData: CategoryKeyModel) => {
        return <>{rowData.label}</>;
    };

    const slugBodyTemplate = (rowData: CategoryKeyModel) => {
        return <Tag value={rowData.slug} className='px-4 py-2'></Tag>;
    };

    const handleEditData = async (category_id: any) => {
        try {
            const editData = await getCategoryById(category_id);
            setSelectedCategory(editData.data);
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    const actionTemplate = (rowData: CategoryKeyModel) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => handleEditData(rowData.key)} >
                    <Edit2 className='h-5' />
                </Button>
            </div>
        )
    }

    return (
        <div className="card bg-slate-100 shadow-lg rounded-md">
            <TreeTable
                header="Category List"
                value={categories != null ? categories : []}
                paginator={categories != null && categories.length > 10} rows={10} rowsPerPageOptions={[5, 10, 15, 20]}
                tableStyle={{ minWidth: '40rem' }}
                className="w-full p-8"
            >
                <Column expander field="label" header="Title" body={titleTemplate} className=" font-semibold"></Column>
                <Column field="slug" header="Slug" className="font-semibold" body={slugBodyTemplate}></Column>
                <Column field="categoryId" header="Actions" body={actionTemplate} className=""> </Column>
            </TreeTable >
        </div>
    );
};

export default CategoryDataTable;
