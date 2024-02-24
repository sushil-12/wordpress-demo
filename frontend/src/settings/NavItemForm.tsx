
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { navItemFormSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { createSlug } from "@/lib/utils";
import { usecreateOrEditNavItem } from "@/lib/react-query/queriesAndMutations";

const NavItemForm: React.FC<{ item: any, setRerender: any }> = ({ item, setRerender }) => {
    const items = [
        { name: 'Custom Post', value: 'custom_post' },
        { name: 'default', value: 'default' }
    ];



    const [type, setType] = useState(null);
    const { mutateAsync: createOrEditNavItem, isPending: isLoading } = usecreateOrEditNavItem();
    const form = useForm<z.infer<typeof navItemFormSchema>>({
        resolver: zodResolver(navItemFormSchema),
        defaultValues: {
            id: item?._id || '',
            route: item?.route || '',
            label: item?.label || '',
            imgUrl: item?.imgURL || '',
            enabled: item?.enabled || true,
            type: item?.type || 'default',
            category: item?.category || false,
            subcategory: [{ name: "", route: "", imgUrl: "" }]
        },
    });

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm();
    console.log(form)
    const { fields, append, remove } = useFieldArray({ control, name: "submenus" });

    useEffect(() => {
        if (item) { console.log(item); form.setValue('id', item._id); form.setValue('route', item.route); form.setValue('label', item.label); form.setValue('imgUrl', item.imgURL); form.setValue('type', item.type); form.setValue('category', item.category); setType(item.type); console.log(form.getValues()) } else { form.reset() };
    }, [item]);
    const { toast } = useToast()

    async function onSubmit(values: z.infer<typeof navItemFormSchema>) {
        const createOrEditNavItemResponse = await createOrEditNavItem(values);
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
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id}>
                                <FormField
                                    name={`subcategory[${index}].name`}
                                    render={({ field }) => (
                                        <div>
                                            <FormLabel>Subcategory Name</FormLabel>
                                            <Input
                                                placeholder="Add name"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <FormField
                                    name={`subcategory[${index}].route`}
                                    render={({ field }) => (
                                        <div>
                                            <FormLabel>Subcategory Route</FormLabel>
                                            <Input
                                                placeholder="Add Route"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <FormField
                                    name={`subcategory[${index}].imgUrl`}
                                    render={({ field }) => (
                                        <div>
                                            <FormLabel>Subcategory Image Url</FormLabel>
                                            <Input
                                                placeholder="Add Url"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <Button type="button" onClick={() => remove(index)}>
                                    Remove Subcategory
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => append({})}>
                            Add Subcategory
                        </Button>
                    </div>

                    <Button type="submit" className="shad-button_primary w-max place-self-end ">
                        Add
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default NavItemForm;
