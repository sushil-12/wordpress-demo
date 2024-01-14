import { useEffect, useState } from 'react';
import CustomFieldDatatable from '@/components/datatable/CustomFieldDatatable';
import { useGetAllCustomFields } from '@/lib/react-query/queriesAndMutations';

const ManageCustomFields = () => {
    const [customFields, setCustomFields] = useState([]);
    const { mutateAsync: getAllCustomFields, isPending: isCustomFieldLoading } = useGetAllCustomFields();
    async function  fetchCustomFields() {
        const customFieldsResponse = await getAllCustomFields('all');
        setCustomFields(customFieldsResponse?.data?.customField)
    }

    useEffect(() => { fetchCustomFields() }, [])
    return (
        <div className="common-container h-100">
            <CustomFieldDatatable isCustomFieldLoading={isCustomFieldLoading} customFields={customFields} />
        </div>
    )
}

export default ManageCustomFields
