import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { usecreateOrEditCustomField } from '@/lib/react-query/queriesAndMutations';
import { CustomFormFieldSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dropdown } from 'primereact/dropdown';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface CustomFieldFormSchema {
    setVisible: any;
    selectedCustomField: any;
}
const CustomFieldForm: React.FC<CustomFieldFormSchema> = ({ setVisible, selectedCustomField }) => {
    const { mutateAsync: createOrEditCustomField, isPending: isCreating } = usecreateOrEditCustomField();
    const { control, getValues } = useForm();

    let { fields, append, remove } = useFieldArray({
        control,
        name: 'fields', // Name of the field array in the form data
    });

    useEffect(() => {
        if (Object.keys(selectedCustomField).length === 0) {
            return;
        }
        while (fields.length > 0) {
            remove(0);
        }

        selectedCustomField != undefined && selectedCustomField.fields.forEach((field:any) => {
            append(field);
        });
    }, [selectedCustomField.fields, append, remove]);

    const variant = [
        { label: 'Repeater Field', value: 'repeater_field' },
        { label: 'Normal Field', value: 'normal_field' },
    ];

    const field_type = [
        { label: 'Text', value: 'text' },
        { label: 'TextArea', value: 'textarea' },
    ];
    const post_type = [
        { label: 'Technology', value: 'technology' },
        { label: 'Invention', value: 'invention' },
    ];

    const form = useForm<z.infer<typeof CustomFormFieldSchema>>({
        resolver: zodResolver(CustomFormFieldSchema),
        defaultValues: {
            id: selectedCustomField._id || '',
            title: selectedCustomField.title || '',
            post_type: selectedCustomField.post_type || '',
            customFields: selectedCustomField.fields || [],
        },
    })

    async function onSubmit(values: z.infer<typeof CustomFormFieldSchema>) {
        const repeaterValues = getValues('fields');
        values.customFields = repeaterValues

        const createOrEditCustomFieldResponse = await createOrEditCustomField(values);
        console.log(createOrEditCustomFieldResponse)
        setVisible(false)
        return;
    }

    return (
        <Form {...form}>
            <div className="">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-8 w-full mt-4"
                >
                    <div className="form_data flex gap-8">
                        <div className="form_elements w-full flex flex-col gap-8">

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter Template label"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />
                            <FormField
                                control={form.control}
                                name="post_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Post Type </FormLabel>
                                        <FormControl>
                                            <Dropdown value={form.getValues('post_type')} onChange={(e) => form.setValue('post_type', e.value)} options={post_type} optionLabel="label"
                                                placeholder="Select Post Type" className="w-full md:w-14rem" />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />

                            {/* Repeater for dynamic fields */}
                            {fields.map((field, index) => (
                                <div key={field.id} className="dynamic-field flex gap-4">
                                    {/* Field 1 in repeater */}
                                    <FormField
                                        control={control}
                                        name={`fields[${index}].label`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="shad-input"
                                                        placeholder="Enter Field Label"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Field 2 in repeater */}
                                    <FormField
                                        control={control}
                                        name={`fields[${index}].field_type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field Type</FormLabel>
                                                <FormControl>
                                                    <Dropdown
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        options={field_type}
                                                        optionLabel="label"
                                                        placeholder="Select Variant"
                                                        className="w-full md:w-14rem"
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Field 3 in repeater */}
                                    <FormField
                                        control={control}
                                        name={`fields[${index}].variant`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field variant</FormLabel>
                                                <FormControl>
                                                    <Dropdown
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        options={variant}
                                                        optionLabel="label"
                                                        placeholder="Select Variant"
                                                        className="w-full md:w-14rem"
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Field 4 in repeater */}
                                    <FormField
                                        control={control}
                                        name={`fields[${index}].placeholder`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field Placeholder</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="shad-input"
                                                        placeholder="Enter Field Placeholder"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    <button type="button" onClick={() => remove(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => append({ label: '', field_type: '', variant: '', placeholder: '' })}
                            >
                                Add Set of Fields
                            </button>

                        </div>

                    </div>

                    <Button type="submit" className="shad-button_primary max-w-fit self-end">
                        Add Field
                    </Button>
                </form>
            </div>
        </Form>
    )
}

export default CustomFieldForm
