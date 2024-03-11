
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { commonNavSchema, navItemFormSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { createSlug } from "@/lib/utils";
import { domainSidebarLinks } from "@/constants";
import { Dropdown } from "primereact/dropdown";
import { saveDatatoSidebar } from "@/lib/appwrite/api";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import { Dialog } from "primereact/dialog";
import SvgPickerComponent from "@/components/shared/SvgPickerComponent";
import SvgComponent from "@/utils/SvgComponent";

type Website =
    | "the_logician"
    | "he_group"
    | "x_wear";

const NavItemForm: React.FC<{ item: any, setRerender: any, activeTab: string, activeDomain?: string, setSelectedItem?: any, setFormType?: any }> = ({ item, setRerender, activeTab, activeDomain, setSelectedItem }) => {

    const items = [
        { name: 'Custom Post', value: 'custom_post' },
        { name: 'default', value: 'default' }
    ];
    const domain = [
        { name: 'The Logician', value: 'the_logician' },
        { name: 'He Group', value: 'he_group' },
        { name: 'X-Wear', value: 'x_wear' },
    ]

    const [type, setType] = useState('custom_post');
    const [svgPicker, setSvgPicker] = useState(false);
    const [repeaterSvgPicker, setRepeaterSvgPicker] = useState(false);
    const [svgName, setSvgName] = useState('');
    const [website, setWebsite] = useState<Website>('the_logician');
    const [selectedMenuAfter, setSelectedMenuAfter] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndexItem, setCurrentIndexItem] = useState([])

    const [localItem, setLocalItem] = useState<any>(item); // Initialize localItem with item passed from parent
    const { control, setValue, getValues } = useForm();
    let { fields, append, remove, update, insert, replace } = useFieldArray({
        control,
        name: 'fields',
    });
    // @ts-ignore
    const updateFieldAtIndex = (index, svgName, currentIndexItem) => {
        // Make sure the index is valid
        console.log(fields);
        if (index >= 0 && index < fields.length) {
            const updatedFields = fields[index];
            console.log("UPDATED FIELDS", updatedFields)
            const label = currentIndexItem[index].label
            console.log("UPDATED", updatedFields)

            const route = createSlug(label);
            let updatedFieldsArray = {
                label: label,
                imgURL: svgName,
                route: route
            };
            update(index, updatedFieldsArray);
        } else {
            console.error('Invalid index provided for update');
        }
    };

    // @ts-ignore
    const validationSchema = {
        comman: commonNavSchema,
        website: navItemFormSchema,
    };

    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Svg Picker <span className="text-sm">(click to choose svg)</span></h1>
                <button onClick={() => setSvgPicker(false)}><img src='/assets/icons/close.svg' className='cursor-pointer' /></button>
            </div>
        );
    };
    const headerRepeaterTemplate = (index: number) => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Svg Picker{index}<span className="text-sm">(click to choose svg)</span></h1>
                <button onClick={() => setRepeaterSvgPicker(false)}><img src='/assets/icons/close.svg' className='cursor-pointer' /></button>
            </div>
        );
    };


    const form = useForm<z.infer<typeof navItemFormSchema>>({
        // @ts-ignore
        resolver: zodResolver(validationSchema[activeTab]),
        defaultValues: {
            id: '',
            domain: '',
            route: '',
            label: '',
            enabled: true,
            place_after: 'end',
            type: 'default',
            category: 'no',
            subcategory: []
        },
    });


    useEffect(() => {
        setLocalItem(item)
        //@ts-ignore
        if (activeDomain) { setWebsite(activeDomain) }
        if (localItem) {
            console.log(type)
            console.log(svgName, localItem, "after reset")
            replace(localItem.subcategory)
            setSvgName(localItem?.imgURL); form.setValue('id', localItem.id); form.setValue('route', localItem.route); form.setValue('label', localItem?.label); form.setValue('type', localItem.type); form.setValue('category', localItem.category ? 'yes' : 'no'); setType(localItem.type);
        } else {
            form.reset()
        };

    }, [item, localItem, activeDomain]);


    const { toast } = useToast()

    async function onSubmit(values: z.infer<typeof navItemFormSchema>) {
        // @ts-ignore
        values.subcategory = fields.map(field => ({
            id: values.id || Math.random().toString(36).substr(2, 9),// @ts-ignore
            label: field.label,// @ts-ignore
            route: createSlug('/' + values.label + '/' + field.route),// @ts-ignore
            imgURL: field.imgURL
        }));

        // @ts-ignore
        let currentWebsiteSchema = domainSidebarLinks.websites[website];
        let currentCommonSchema = domainSidebarLinks.comman;
        let route_link = values.type === 'custom_post' ? `/posts/${values.route}` : `/` + values.route;

        if (activeTab === 'website') {
            const webObject = { id: values.id || Math.random().toString(36).substr(2, 9), imgURL: svgName, route: route_link, label: values.label, category: values.category === 'yes', type: values.type || 'default' };
            if (values.id) {
                // @ts-ignore
                const index = currentWebsiteSchema.findIndex(item => item.id === values.id);
                if (index !== -1) {
                    currentWebsiteSchema.splice(index, 1, webObject);
                }
            } else {
                // @ts-ignore
                const index = currentWebsiteSchema.findIndex(item => item.label === values.place_after);
                if (index !== -1) {
                    currentWebsiteSchema.splice(index + 1, 0, webObject);
                }
            }
            // @ts-ignore
            domainSidebarLinks.websites[website] = currentWebsiteSchema;
        }
        else {
            let newobject;

            if (values.subcategory.length > 0) {
                newobject = { id: values.id || Math.random().toString(36).substr(2, 9), imgURL: svgName, route: route_link, label: values.label, subcategory: values.subcategory };
            } else {
                newobject = { id: values.id || Math.random().toString(36).substr(2, 9), imgURL: svgName, route: route_link, label: values.label };
            }

            console.log("NEW OBJECTS", newobject)

            // @ts-ignore
            if (values.id) {
                // @ts-ignore
                const index = currentCommonSchema.findIndex(item => item.id === values.id);
                if (index !== -1) {
                    // @ts-ignore
                    currentCommonSchema.splice(index, 1, newobject);
                }
            } else {
                // @ts-ignore
                /* const index = currentWebsiteSchema.findIndex(item => item.label === values.place_after);
                if (index !== -1) {
                    currentWebsiteSchema.splice(index + 1, 0, newobject);
                } *///@ts-ignore
                currentCommonSchema.push(newobject);
            }

        }


        const createOrEditNavItemResponse = await saveDatatoSidebar(domainSidebarLinks);

        if (createOrEditNavItemResponse?.code === 200 || createOrEditNavItemResponse?.code === 201) {
            const message = createOrEditNavItemResponse?.code === 200 ? 'Successfully Updated Post' : 'Successfully Created Post';
            form.reset();
            replace([]);
            setRerender((prev: boolean) => !prev);
            setSelectedItem(null); setSvgName('');
            return toast({ variant: 'default', description: message });
        } else {
            return toast({ variant: 'default', description: 'Something went wrong' });
        }
    }

    return (
        <Form {...form}>
            <div className="border-l pl-4">
                <div className="flex justify-between items-center">
                    <h6 className="bold font-semibold under py-4">SideBar Form</h6>
                    <Button type="submit" onClick={() => { event?.preventDefault(); form.reset(); setSelectedItem(null); setSvgName(''); setLocalItem(null); setRerender((prev: boolean) => !prev); setSvgName(''); replace([]); }} className=" border border-primary-500 h-30 bg-primary-500 text-white ">
                        + Add New
                    </Button>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-3 w-full mt-4"
                >
                    <FormField control={form.control} name="label" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Navigation Label</FormLabel>
                            <FormControl><Input className="" placeholder="Add label" {...field} onInput={(e) => form.setValue('route', createSlug((e.target as HTMLSelectElement).value))} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />

                    {activeTab !== 'comman' && (
                        <FormField control={form.control} name="label" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Type</FormLabel>
                                <FormControl>
                                    <SelectButton
                                        value={type} onChange={(e) => { setType(e.value); form.setValue('type', e.value); console.log(form.getValues(), form) }}
                                        optionLabel="name"
                                        options={items}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>

                        )}
                        />)}
                    {activeTab !== 'comman' && (
                        <FormField control={form.control} name="domain" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Website</FormLabel>
                                <FormControl>
                                    <SelectButton
                                        value={website} onChange={(e) => { setWebsite(e.value); form.setValue('domain', e.value); console.log(form.getValues(), form) }}
                                        optionLabel="name"
                                        options={domain}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>

                        )}
                        />
                    )}
                    {activeTab !== 'comman' && (
                        <FormField control={form.control} name="place_after" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select After</FormLabel>
                                <FormControl>
                                    {/* @ts-ignore  */}
                                    <Dropdown value={selectedMenuAfter} onChange={(e) => { setSelectedMenuAfter(e.value); form.setValue('place_after', e.value.label); }} optionLabel="label" options={domainSidebarLinks.websites[website]}
                                        placeholder="Place After" className="w-full md:w-14rem" />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>

                        )}
                        />)}

                    <FormLabel>
                        <div className="flex align-middle items-center">Choose Icon
                            <Button onClick={(e) => { e.preventDefault(); setSvgPicker(true); }} ><Edit3Icon /></Button >
                            {/* @ts-ignore */}
                            <SvgComponent className="border border-primary-500 p-4" svgName={svgName} />
                        </div>
                    </FormLabel>

                    {activeTab !== 'comman' && type != 'default' &&
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enable Category</FormLabel>
                                <FormControl className="mx-4 mt-4">
                                    <InputSwitch
                                        checked={form.getValues("category") === 'yes'}
                                        onChange={(e) => {
                                            const newValue = form.getValues("category") === 'yes' ? 'no' : 'yes';
                                            form.setValue("category", newValue);
                                            field.onChange(newValue);
                                            console.log(form, form.getValues("category") === 'yes')
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )} />
                    }

                    {activeTab === 'comman' && (
                        <div className="border border-dashed">
                            {fields.map((field, index) => (
                                <div key={field.id} className="dynamic-field p-4 flex gap-4 font-inter text-sm align-middle">
                                    {/* Field 1 in repeater */}
                                    <FormField
                                        control={control}
                                        name={`fields[${index}].label`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Field Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        onInput={(e) => {// @ts-ignore
                                                            const labelValue = e.target.value;// @ts-ignore
                                                            setValue('label', labelValue);// @ts-ignore
                                                            const existingIndex = currentIndexItem.findIndex(item => item.index === index);
                                                            console.log(existingIndex)
                                                            if (existingIndex !== -1) {
                                                                setCurrentIndexItem(prevIndexItem => {
                                                                    const updatedItem = [...prevIndexItem];// @ts-ignore
                                                                    updatedItem[existingIndex] = { ...updatedItem[existingIndex], label: labelValue };
                                                                    return updatedItem;
                                                                });
                                                            } else {
                                                                // @ts-ignore
                                                                setCurrentIndexItem(prevIndexItem => [...prevIndexItem, { index, label: labelValue }]);
                                                            }
                                                        }}
                                                        className="shad-input"
                                                        placeholder="Enter Field Label"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Icon Selection */}
                                    <div className="flex align-middle items-center">
                                        Choose Icon {index}
                                        <Button onClick={(e) => { e.preventDefault(); setRepeaterSvgPicker(true); setCurrentIndex(index) }} ><Edit3Icon /></Button >
                                        <Dialog visible={repeaterSvgPicker} onHide={() => setRepeaterSvgPicker(false)} style={{ width: '60vw' }} header={headerRepeaterTemplate(currentIndex)} closable={false} >
                                            <SvgPickerComponent setSvgName={currentIndex} currentIndexItem={currentIndexItem} updateFieldAtIndex={updateFieldAtIndex} setSvgPicker={setRepeaterSvgPicker} form_type={'repeater'} />
                                        </Dialog>
                                        {/* @ts-ignore */}
                                        <SvgComponent className="border border-primary-500 p-4" svgName={fields[index].imgURL} />
                                    </div>

                                    {/* Remove Field Button */}
                                    <button type="button" onClick={() => remove(index)}>
                                        <SvgComponent className="" svgName={'delete'} />
                                    </button>
                                </div>
                            ))}
                            {/* Button to Add Set of Fields */}
                            <button
                                type="button"
                                className="bg-primary-500 py-2 w-[200px] text-white text-sm rounded float-end"
                                onClick={() => append({ label: '' })}
                            >
                                Add New Submenu
                            </button>
                        </div>
                    )}

                    <Dialog visible={svgPicker} onHide={() => setSvgPicker(false)} style={{ width: '60vw' }} header={headerTemplate} closable={false} > {/* @ts-ignore */}
                        <SvgPickerComponent setSvgName={setSvgName} setSvgPicker={setSvgPicker} />
                    </Dialog>

                    <div className="flex gap-4">
                        {/* <Button type="submit" onClick={() => { event?.preventDefault(); form.reset(); setSelectedItem(null); setSvgName(''); setLocalItem(null);  setRerender((prev: boolean) => !prev);  setSvgName('') }} className=" border border-primary-500 ">
                            Reset
                        </Button> */}
                        <Button type="submit" className="shad-button_primary ">
                            Save
                        </Button>

                    </div>

                </form>
            </div>
        </Form>
    );
};

export default NavItemForm;
