
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
import { domainSidebarLinks, websiteMenus } from "@/constants";
import { Dropdown } from "primereact/dropdown";
import { saveDatatoSidebar } from "@/lib/appwrite/api";
import { Edit3Icon } from "lucide-react";
import { Dialog } from "primereact/dialog";
import SvgPickerComponent from "@/components/shared/SvgPickerComponent";
import UploadSvgForm from "./UploadSvgForm";

type Website =
    | "the_logician"
    | "he_group"
    | "x_wear";

const NavItemForm: React.FC<{ item: any, setRerender: any, activeTab: string }> = ({ item, setRerender, activeTab }) => {

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

    // @ts-ignore
    const validationSchema = {
        comman: commonNavSchema,
        website: navItemFormSchema,
    };

    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Svg Picker <span className="text-sm">(double click to choose svg)</span></h1>
                <button onClick={() => setSvgPicker(false)}><img src='/assets/icons/close.svg' className='cursor-pointer' /></button>
            </div>
        );
    };

    const form = useForm<z.infer<typeof navItemFormSchema>>({
        // @ts-ignore
        resolver: zodResolver(validationSchema[activeTab]),
        defaultValues: {
            id: item?._id || '',
            domain: item?.domain || '',
            route: item?.route || '',
            label: item?.label || '',
            enabled: item?.enabled || true,
            place_after: item?.place_after || 'end',
            type: item?.type || 'default',
            category: item?.category || false,
            // subcategory: [{ name: "", route: "", imgUrl: "" }]
        },
    });
    console.log(item, "Skected");
    useEffect(() => {
        if (item) {
            setSvgName(item?.imgURL); form.setValue('id', item._id); form.setValue('route', item.route); form.setValue('label', item?.label); form.setValue('type', item.type); form.setValue('category', item.category); setType(item.type);
        } else {
            form.reset()
        };
    }, [item]);

    const { toast } = useToast()

    async function onSubmit(values: z.infer<typeof navItemFormSchema>) {
        // @ts-ignore
        let currentWebsiteSchema = domainSidebarLinks.websites[website];
        let currentCommonSchema = domainSidebarLinks.comman;
        let route_link = values.type === 'custom_post' ? `posts/${values.route}` : values.route;
        let newobject = { imgURL: svgName, route: values.route, label: values.label };
        console.log(newobject, "NEW OBJECT"); alert("test")

        // @ts-ignore
        if (activeTab == 'websites') {
            // @ts-ignore
            const index = currentWebsiteSchema.findIndex(item => item.label === values.place_after);
            if (index !== -1) {
                currentWebsiteSchema.splice(index + 1, 0, newobject);
                // @ts-ignore
                domainSidebarLinks.websites[website] = currentWebsiteSchema;
            }
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
                            <Button onClick={(e) => { e.preventDefault(); setSvgPicker(true); }} >
                                <Edit3Icon /></Button >
                        </div>
                    </FormLabel>
                    <FormControl><Input className="" placeholder="Pick an Svg" value={svgName} /></FormControl>
                    {activeTab !== 'comman' && type != 'default' &&
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enable Category</FormLabel>
                                <FormControl className="mx-4 mt-4">
                                    <InputSwitch
                                        checked={form.getValues('category')}
                                        onChange={(e) => { form.setValue('category', e.value) }}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )} />
                    }
                    <Dialog visible={svgPicker} onHide={() => setSvgPicker(false)} style={{ width: '60vw' }} header={headerTemplate} closable={false} >
                        <SvgPickerComponent setSvgName={setSvgName} />
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
