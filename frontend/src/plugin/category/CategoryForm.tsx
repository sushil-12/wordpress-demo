import { useCreateOrEditCategory, useGetAllCategories } from '@/lib/react-query/queriesAndMutations';
import { CategoryModel } from '@/lib/types';
import { categoryFormSchema } from '@/lib/validation';
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreeSelect, TreeSelectChangeEvent } from 'primereact/treeselect';
import { createSlug } from '@/lib/utils';
import { useCategory } from './CategoryContext';

interface CategoryProps {
    post_type: any;
}

const CategoryForm: React.FC<CategoryProps> = ({ post_type }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: createOrEditCategory, isPending: isOperating } = useCreateOrEditCategory();
    const { categories, setCategories, selectedCategory, setSelectedCategory } = useCategory();
    const [currentCategory, setCurrentCategory] = useState<CategoryModel | null>(selectedCategory);
    const { mutateAsync: getAllCategories, isPending: isLoading } = useGetAllCategories();

    const [selectedNodeKeys, setSelectedNodeKeys] = useState<any>('');
    useEffect(() => {
        setCurrentCategory(selectedCategory);
        setSelectedNodeKeys(selectedCategory?.parentCategory)
        // Reset the form with updated default values
        form.reset({
            id: selectedCategory?.id || '',
            name: selectedCategory?.name || '',
            postType: post_type,
            parentCategory: selectedCategory?.parentCategory || '',
            slug: selectedCategory?.slug || '',
            description: selectedCategory?.description || '',
        });
    
        async function fetchCategories() {
            const categoryData = await getAllCategories(post_type);
            setCategories(categoryData.data.categories);
        }
        fetchCategories();
    }, [selectedCategory]);

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            id: currentCategory?.id || '',
            name:currentCategory?.name||'',
            postType: post_type,
            parentCategory: currentCategory?.parentCategory || '',
            slug: currentCategory?.slug || '',
            description: currentCategory?.description || '',
        },
    });

    async function onSubmit(values: z.infer<typeof categoryFormSchema>) {

        const createOrEditPostResponse = await createOrEditCategory(values);
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: "Edit Failed" })
        }
        if (createOrEditPostResponse?.code === 200 || createOrEditPostResponse?.code === 201) {
            const updatedPost = createOrEditPostResponse?.data?.post;
            setCurrentCategory(updatedPost);
            form.setValue('id', updatedPost?.id);
            const message = createOrEditPostResponse?.code === 200 ? 'Successfully Updated Post' : 'Successfully Created Post';
            navigate('/category/' + post_type)
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
                    className="space-y-1 flex flex-col gap-8 w-full mt-4"
                >
                    <div className="form_data flex gap-8">
                        <div className="form_elements w-full flex flex-col gap-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                onBeforeInput={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    form.setValue('slug', createSlug(e.target.value));
                                                }}
                                                className="shad-input"
                                                placeholder="Enter Category Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter slug"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />
                            <FormField
                                control={form.control}
                                name="parentCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Category</FormLabel>
                                        <FormControl>
                                            <TreeSelect
                                                value={selectedNodeKeys}
                                                onChange={(e: TreeSelectChangeEvent) => {
                                                    setSelectedNodeKeys(e.value || '');
                                                    field.onChange(e.value);
                                                }}
                                                options={categories}
                                                metaKeySelection={false}
                                                className="md:w-20rem w-full"
                                                selectionMode="single"
                                                placeholder="Select Items"
                                            ></TreeSelect>
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />

                        </div>

                    </div>
                    <Button type="submit" className="shad-button_primary max-w-fit self-end" disabled={isOperating}>
                        {isOperating ? <Loader /> : 'Create'}
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default CategoryForm
