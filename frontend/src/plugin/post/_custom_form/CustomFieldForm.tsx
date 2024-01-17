import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPostsAndPages, usecreateOrEditCustomField } from '@/lib/react-query/queriesAndMutations';
import { CustomFormFieldSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface CustomFieldFormSchema {
    setVisible: any;
    selectedCustomField: any;
}
const CustomFieldForm: React.FC<CustomFieldFormSchema> = ({ setVisible, selectedCustomField }) => {
    const { mutateAsync: createOrEditCustomField, isPending: isCreating } = usecreateOrEditCustomField();
    const { mutateAsync: getAllPostsAndPages, isPending: isLoading } = useGetAllPostsAndPages()
    const { control, getValues } = useForm();
    const { toast } = useToast();
    const [postType, setPostType] = useState([]);
    let { fields, append, remove } = useFieldArray({
        control,
        name: 'fields', // Name of the field array in the form data
    });

    async function getPostTypesAndPages(type:any) {
        const fetchTypeData = await getAllPostsAndPages(type);
        setPostType(fetchTypeData.data.posts);
    }
    useEffect(() => {
        if (Object.keys(selectedCustomField).length === 0) {
            return;
        }
        while (fields.length > 0) {
            remove(0);
        }
        if(selectedCustomField.item_type !=''){
           getPostTypesAndPages(selectedCustomField.item_type);
        }

        selectedCustomField != undefined && selectedCustomField.fields.forEach((field: any) => {
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
    const item_type = [
        { label: 'Custom Posts', value: 'custom_post' },
        { label: 'Page', value: 'page' },
    ];
    

    const form = useForm<z.infer<typeof CustomFormFieldSchema>>({
        resolver: zodResolver(CustomFormFieldSchema),
        defaultValues: {
            id: selectedCustomField._id || '',
            title: selectedCustomField.title || '',
            post_type: selectedCustomField.post_type || '',
            item_type:selectedCustomField.item_type || '',
            customFields: selectedCustomField.fields || [],
        },
    })

    async function handleChange (type:string)  {
        await getPostTypesAndPages(type);
        form.setValue('item_type', type)
    }

    async function onSubmit(values: z.infer<typeof CustomFormFieldSchema>) {
        const repeaterValues = getValues('fields');
        values.customFields = repeaterValues

        const createOrEditCustomFieldResponse = await createOrEditCustomField(values);
        if(createOrEditCustomFieldResponse.status == "error" ){
            setVisible(false)
            return toast({ variant: 'destructive', description: createOrEditCustomFieldResponse.message });
        }
        const message = createOrEditCustomFieldResponse?.code === 200 ? 'Successfully Updated CustomField' : 'Successfully Created CustomField';
        setVisible(false)
        selectedCustomField = {};
        if (createOrEditCustomFieldResponse) { return toast({ variant: 'default', description: message }); }
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
                                        <FormLabel>Item Type </FormLabel>
                                        <FormControl>
                                            <Dropdown value={form.getValues('item_type')} onChange={(e) => {handleChange(e.value)}} options={item_type} optionLabel="label"
                                                placeholder="Select Post Type" className="w-full md:w-14rem" />
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
                                            <Dropdown value={form.getValues('post_type')} onChange={(e) => form.setValue('post_type', e.value)} options={postType} optionLabel="label"
                                                placeholder="Select Post Type" className="w-full md:w-14rem" />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />

                            {/* Repeater for dynamic fields */}
                            {fields.map((field, index) => (
                                <div key={field.id} className="dynamic-field flex gap-4 align-middle">
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
                                        <Trash2Icon />
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
