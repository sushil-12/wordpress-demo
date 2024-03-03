
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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
import { Edit3Icon } from "lucide-react";
import { Dialog } from "primereact/dialog";
import SvgPickerComponent from "@/components/shared/SvgPickerComponent";
import SvgComponent from "@/utils/SvgComponent";

type Website =
    | "the_logician"
    | "he_group"
    | "x_wear";

const NavItemForm: React.FC<{ item: any, setRerender: any, activeTab: string, activeDomain?: string, setSelectedItem?:any, setFormType?:any }> = ({ item, setRerender, activeTab, activeDomain,setSelectedItem }) => {

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
    const [svgName, setSvgName] = useState('');
    const [website, setWebsite] = useState<Website>('the_logician');
    const [selectedMenuAfter, setSelectedMenuAfter] = useState(null);
    const [localItem, setLocalItem] = useState<any>(item); // Initialize localItem with item passed from parent


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

    const form = useForm<z.infer<typeof navItemFormSchema>>({
        // @ts-ignore
        resolver: zodResolver(validationSchema[activeTab]),
        defaultValues: {
            id:  '',
            domain:  '',
            route:  '',
            label: '',
            enabled: true,
            place_after: 'end',
            type: 'default',
            category: 'no',
            // subcategory: [{ name: "", route: "", imgUrl: "" }]
        },
    });

    useEffect(() => {
        //@ts-ignore
        console.log(item)
        setLocalItem(item)

        if (activeDomain) { setWebsite(activeDomain) }
        if (localItem) {
            setSvgName(localItem?.imgURL); form.setValue('id', localItem.id); form.setValue('route', localItem.route); form.setValue('label', localItem?.label); form.setValue('type', localItem.type); form.setValue('category', localItem.category?'yes':'no'); setType(localItem.type);
        } else {
            form.reset()
        };

    }, [item, localItem, activeDomain]);

    const { toast } = useToast()
    console.log(form, form.getValues(),localItem, "Hsa")
    async function onSubmit(values: z.infer<typeof navItemFormSchema>) {
        // @ts-ignore
        let currentWebsiteSchema = domainSidebarLinks.websites[website];
        let currentCommonSchema = domainSidebarLinks.comman;
        let route_link = values.type === 'custom_post' ? `/posts/${values.route}` : values.route;
        let newobject = { imgURL: svgName, route: route_link, label: values.label };

       
        if (activeTab === 'website') {
            const webObject = {  id: values.id || Math.random().toString(36).substr(2, 9),  imgURL: svgName, route: route_link, label: values.label, category: values.category === 'yes', type: values.type || 'default' };
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
            // @ts-ignore
            const index = currentCommonSchema.findIndex(item => item.label === values.label);
            if (index !== -1) {
                // @ts-ignore
                currentCommonSchema.splice(index, 1, newobject);
            } else {
                // @ts-ignore
                currentCommonSchema.push(newobject);
            }

        }


        const createOrEditNavItemResponse = await saveDatatoSidebar(domainSidebarLinks);

        if (createOrEditNavItemResponse?.code === 200 || createOrEditNavItemResponse?.code === 201) {
            const message = createOrEditNavItemResponse?.code === 200 ? 'Successfully Updated Post' : 'Successfully Created Post';
            form.reset();
            setRerender((prev: boolean) => !prev);
            setSelectedItem(null); setSvgName('');
            return toast({ variant: 'default', description: message });
        } else {
            return toast({ variant: 'default', description: 'Something went wrong' });
        }
    }

    return (
        <Form {...form}>
            <div className="">
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
                    <Dialog visible={svgPicker} onHide={() => setSvgPicker(false)} style={{ width: '60vw' }} header={headerTemplate} closable={false} >
                        <SvgPickerComponent setSvgName={setSvgName} setSvgPicker={setSvgPicker} />
                    </Dialog>

                    <Button type="submit" className="shad-button_primary w-max place-self-end ">
                        Add
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default NavItemForm;
