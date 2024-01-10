import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusSquareIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface RepeaterCustomFieldProps {
    label: string;
    name: string;
    type: 'text' | 'textarea' | 'radio';
    form: any;
    placeholder?: string;
}

const RepeaterCustomField: React.FC<RepeaterCustomFieldProps & { customRepeaterFields: any[]; setCustomRepeaterFields: any }> = ({ label, name, type, form, placeholder, customRepeaterFields, setCustomRepeaterFields, ...rest }) => {

   const [repeaterFields, setRepeaterFields] = useState([{ id: Date.now(), name:'', value: '' }]);
   const formObject = { id: name + type, name: name, value: [] };           
    const handleAddField = () => {
        setRepeaterFields((prevFields) => [...prevFields, { id: Date.now(), name: label, value: '' }]);
    };

    const handleRemoveField = (id: number) => {
        if (repeaterFields.length > 1) {
            const updatedFields = repeaterFields.filter((field) => field.id !== id);
            setRepeaterFields(updatedFields);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        setRepeaterFields((prevFields) => {
            const updatedFields = prevFields.map((field) =>
                field.id === id ? { ...field, value: e.target.value } : field
            );
            return updatedFields;
          
        });
        const valuesArray = repeaterFields.map((field) => field.value);
        formObject.value = valuesArray
        console.log('suhsi', formObject, customRepeaterFields)
        
        console.log(form.getValues())
        form.setValue('customRepeaterFields', customRepeaterFields)
    };


    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>{label}</label>
            {repeaterFields.map((field) => (
                <div key={field.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <FormControl style={{ marginRight: '8px' }}>
                        {renderInput(type, field, placeholder, rest, field.id, onChange)}
                    </FormControl>
                    {repeaterFields.length > 1 && (
                        <button type="button" onClick={() => handleRemoveField(field.id)}>
                            <Trash2Icon />
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAddField} style={{ marginTop: '8px' }}>
                <PlusSquareIcon />
            </button>
        </div>
    );
};

const renderInput = (type: string, field: any, placeholder: string | undefined, rest: any, id: number, onChange: any) => {
    switch (type) {
        case 'text':
            return <Input className="shad-input" placeholder={placeholder} value={field.value || ''} onInput={(e) => onChange(e, id)} {...rest} />;
        case 'textarea':
            return <Textarea className="shad-input" placeholder={placeholder} value={field.value || ''} onInput={(e) => onChange(e, id)} {...rest} />;
        default:
            return null;
    }
};

export default RepeaterCustomField;
