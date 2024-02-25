
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { navItemFormSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { createSlug } from "@/lib/utils";
import { usecreateOrEditNavItem } from "@/lib/react-query/queriesAndMutations";
import { domainSidebarLinks, websiteMenus } from "@/constants";
import { Dropdown } from "primereact/dropdown";
import { saveDatatoSidebar } from "@/lib/appwrite/api";

type Website =
    | "the_logician"
    | "he_group"
    | "x_wear";

const NavItemForm: React.FC<{ item: any, setRerender: any }> = ({ item, setRerender }) => {

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
    const [website, setWebsite] = useState<Website>('the_logician');
    const [selectedMenuAfter, setSelectedMenuAfter] = useState(null);

    const form = useForm<z.infer<typeof navItemFormSchema>>({
        resolver: zodResolver(navItemFormSchema),
        defaultValues: {
            id: item?._id || '',
            domain: item?.domain || '',
            route: item?.route || '',
            label: item?.label || '',
            imgUrl: item?.imgURL || '',
            enabled: item?.enabled || true,
            place_after: item?.place_after || 'end',
            type: item?.type || 'default',
            category: item?.category || false,
            // subcategory: [{ name: "", route: "", imgUrl: "" }]
        },
    });

    useEffect(() => {
        if (item) { console.log(item); form.setValue('id', item._id); form.setValue('route', item.route); form.setValue('label', item.label); form.setValue('imgUrl', item.imgURL); form.setValue('type', item.type); form.setValue('category', item.category); setType(item.type); console.log(form.getValues()) } else { form.reset() };
    }, [item]);
    const { toast } = useToast()

    async function onSubmit(values: z.infer<typeof navItemFormSchema>) {
        // @ts-ignore
        let currentWebsiteSchema = domainSidebarLinks.websites[website];
        let route_link = values.type === 'custom_post' ? `posts/${values.route}` : values.route;
        let newobject = { imgURL: values.imgUrl, route: values.route, label: values.label };
        // @ts-ignore
        const index = currentWebsiteSchema.findIndex(item => item.label === values.place_after);
        if (index !== -1) {
            currentWebsiteSchema.splice(index + 1, 0, newobject);
        }
        // @ts-ignore
        domainSidebarLinks.websites[website] = currentWebsiteSchema;
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
                            <FormControl><Input className="shad-input" placeholder="Add label" {...field} onInput={(e) => form.setValue('route', createSlug((e.target as HTMLSelectElement).value))} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
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
                    />
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
                    />

                    <FormField control={form.control} name="imgUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image Url</FormLabel>
                            <FormControl><Input className="shad-input" placeholder="Enter imgUrl" {...field} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    {type != 'default' &&
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

                    <Button type="submit" className="shad-button_primary w-max place-self-end ">
                        Add
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default NavItemForm;
