import { Edit2, PlusSquare } from 'lucide-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Button } from '../ui/button';
import { InputSwitch } from 'primereact/inputswitch';
import { useQuickEditNavItemsbyIDApi } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';

interface NavDatatableprops {
    navItems: any;
    setSelectedItem: any;
    render: boolean;
}

const NavDatatable: React.FC<NavDatatableprops> = ({ navItems, setSelectedItem, render }) => {
    const { mutateAsync: quickEditNavItemsbyID, isPending: isEditing } = useQuickEditNavItemsbyIDApi();
    const [value, setValue] = useState(setSelectedItem.enabled || true)
    const handleStatusChange =  async (rowData: any, newValue: boolean) => {
        try {
            const updatedPost = { ...rowData, enabled: newValue };
            console.log(value)
            setValue(newValue)
            console.log(value)

            const response = await quickEditNavItemsbyID({ category_id: rowData._id, categoryData: updatedPost });
            console.log(response);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => setSelectedItem(rowData)} >
                    <Edit2 className='h-5' />
                </Button>
            </div>
        );
    };

    const titleTemplate = (rowData: any) => {
        return <h6>{rowData.label}</h6>;
    };

    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.type} className={`'px-4 py-2' ${render}`}></Tag>;
    };
    // const statusTemplate = (rowData: any) => {
    //     return <InputSwitch checked={rowData.enabled} onChange={(e) => handleStatusChange(rowData, e.value)} />;
    // };

    return (
        <div className="card bg-slate-100 shadow-lg rounded-md">
            <div className="border-b border-gray-200 bg-white  py-2 flex justify-between px-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3 p-4"> Nav Items</h3>
                <button
                    className="text-base font-semibold leading-6 text-gray-900 flex gap-3 p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <PlusSquare /> Add New
                </button>
            </div>
            <DataTable
                value={navItems}
                metaKeySelection={false}
                tableStyle={{ minWidth: '40rem' }}
                className="w-full p-8"
            >
                <Column expander field="label" header="Title" body={titleTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                <Column expander field="label" header="Type" body={statusBodyTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                {/* <Column expander field="label" header="Status" body={statusTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column> */}
                <Column expander field="label" header="Action" body={actionTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
            </DataTable >
        </div>
    );
};

export default NavDatatable;
