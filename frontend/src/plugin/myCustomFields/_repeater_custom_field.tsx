import { useEffect, useState } from 'react';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusSquareIcon, Trash2Icon } from 'lucide-react';

interface RepeaterFieldProps {
  label: string;
  name: string;
  type: 'text' | 'textarea';
  form: any;
  placeholder?: string;
  customRepeaterFields: any;
  setCustomRepeaterFields: any;
}

const RepeaterField: React.FC<RepeaterFieldProps> = ({ label, name, type, form, placeholder, customRepeaterFields, setCustomRepeaterFields }) => {
  const [fields, setFields] = useState([{ id: Date.now(), name: name, value: '' }]);

  useEffect(() => {
    if (customRepeaterFields.length > 0) {
      const filteredFields = customRepeaterFields.filter((field: any) => field.name === name);

      if (filteredFields.length > 0) {
        const newFields = filteredFields.flatMap((field: any) =>
          field.value.map((value, index) => ({
            id: Date.now(),
            name: field.name,
            value: value,
          }))
        );

        setFields(newFields);
      }
    }
  }, [customRepeaterFields, name]);

  const handleAddField = () => {
    setFields((prevFields) => [...prevFields, { id: Date.now(), name: name, value: '' }]);
  };

  const handleRemoveField = (id: number) => {
    if (fields.length > 1) {
      setFields((prevFields) => prevFields.filter((field) => field.id !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id && field.name === name ? { ...field, value: e.target.value } : field))
    );

    const repeaterFieldPayload = prepareRepeaterFieldData();

    setCustomRepeaterFields((prevFields: any) => {
      const updatedFields = [...prevFields];
      const existingFieldIndex = updatedFields.findIndex((field) => field.name === repeaterFieldPayload.name);

      if (existingFieldIndex !== -1) {
        updatedFields[existingFieldIndex].value = repeaterFieldPayload.value;
      } else {
        updatedFields.push(repeaterFieldPayload);
      }

      form.setValue('customRepeaterFields', updatedFields);
      return updatedFields;
    });
  };

  const prepareRepeaterFieldData = () => {
    const valueArray = fields.map((field) => field.value);
    const formObject = { name: name, type: type, value: valueArray };
    return formObject;
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px' }}>{label}</label>
      {fields.map((field) => (
        <div key={field.id + name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <FormControl style={{ marginRight: '8px' }}>
            {type === 'text' ? (
              <Input
                className="shad-input"
                placeholder={placeholder}
                value={field.value || ''}
                onChange={(e) => handleChange(e, field.id)}
              />
            ) : (
              <Textarea
                className="shad-input"
                placeholder={placeholder}
                value={field.value || ''}
                onChange={(e) => handleChange(e, field.id)}
              />
            )}
          </FormControl>
          {fields.length > 1 && (
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

export default RepeaterField;
