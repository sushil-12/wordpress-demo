import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';
import SkeletonTable from '../skeletons/SkeletonTable';
import { DataTable } from 'primereact/datatable';
import { Button } from '../ui/button';
import { Edit2, PlusSquare } from 'lucide-react';
import { useGetAllCustomFields, useGetCustomFieldsbyIDApi } from '@/lib/react-query/queriesAndMutations';
import { Dialog } from 'primereact/dialog';
import CustomFieldForm from '@/plugin/post/_custom_form/CustomFieldForm';
import { useUserContext } from '@/context/AuthProvider';
import { useParams } from 'react-router-dom';


const CustomFieldDatatable = () => {
    const {domain} = useParams();
    const {setCurrentDomain} = useUserContext();
    // @ts-ignore
    setCurrentDomain(domain)
    const [visible, setVisible] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [selectedCustomField, setSelectedCustomField] = useState({});
    const { mutateAsync: getAllCustomFields, isPending: isCustomFieldLoading } = useGetAllCustomFields();

    async function  fetchCustomFields() {
        const customFieldsResponse = await getAllCustomFields('all');
        setCustomFields(customFieldsResponse?.data?.customField)
    }

    useEffect(() => {fetchCustomFields() }, [visible])
    const titleTemplate = (rowData: any) => {
        return <>{!isCustomFieldLoading ? rowData.title : <Skeleton width='100' height='1.5rem' />}</>;
    };

    const postTypeTemplate = (rowData: any) => {
        return <Tag value={rowData.item_type} className='px-4 py-2'></Tag>;
    };

    const header = <div className="text-lg font-bold flex justify-between">Custom Fields Template </div>;
    const handleEditData = async (custom_field_id: any) => {
        try {
            setSelectedCustomField(custom_field_id);
            setVisible(true)
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };
    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => handleEditData(rowData)} >
                    <Edit2 className='h-5' />
                </Button>
            </div>
        )
    }

    return (
        <div className="card bg-slate-100 shadow-lg rounded-md">
            <div className="border-b border-gray-200 bg-white  py-2 flex justify-between px-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3 p-4"> Manage Custom Fields</h3>
                <Button className="shad-button_primary place-self-end" size="sm" onClick={() => {setVisible(true); setSelectedCustomField({});}} >
                    <PlusSquare /> Add New
                </Button>
            </div>
            <Dialog header="Add/Edit Template" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <CustomFieldForm setVisible={setVisible}  selectedCustomField ={selectedCustomField}/>
            </Dialog>
            {isCustomFieldLoading ? (<SkeletonTable rowCount={5} />) : (
                <DataTable
                    metaKeySelection={false}
                    header={header}
                    value={customFields}
                    paginator={customFields && customFields.length > 2} rows={2} rowsPerPageOptions={[5, 10, 15, 20]}
                    tableStyle={{ minWidth: '40rem' }}
                    className="w-full p-8"
                >
                    <Column expander field="label" header="Title" body={titleTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                    <Column expander field="item_type" header="Item Type" body={postTypeTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                    <Column field="customFieldsId" header="Actions" body={actionTemplate} className=""><Skeleton width="100%" height="1.5rem" /> </Column>
                </DataTable >)}
        </div>
    );
};

export default CustomFieldDatatable;
