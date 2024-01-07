import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostFormSchema } from "@/lib/validation";
import { z } from "zod";
import { Editor } from "primereact/editor";
import MediaPicker from "@/components/shared/MediaPicker";
import { Card } from "primereact/card";
import { useCreateOrEditPost, useGetAllCategories } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { PostModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Tree } from "primereact/tree";

interface PostFormSchema {
    post_type: string | undefined,
    post: PostModel | null,
}
const PostForm: React.FC<PostFormSchema> = ({ post_type, post }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: createOrEditPost, isPending: isOperating } = useCreateOrEditPost();
    const [currentPost, setCurrentPost] = useState<PostModel | null>(post);
    const { currentDomain } = useUserContext();
    const [categories, setCategories] = useState([]);
    const { mutateAsync: getAllCategories, isPending: isCategoryLoading } = useGetAllCategories();
    const [selectedKeys, setSelectedKeys] = useState(post?.categoryObject);
    const [metaKey, setMetaKey] = useState(false);

    async function fetchCategories() {
        if (post_type) {
            const categoryData = await getAllCategories(post_type);
            setCategories(categoryData.data.categories);
        }
    }

    useEffect(() => {
        if(post?.categoryObject) {setSelectedKeys(post.categoryObject)}
        fetchCategories();
    }, [currentPost]);

    const handleTreeSelectionChange = (selectedItems:any) => {
        setSelectedKeys(selectedItems)
        const selectedValuesArray = Object.keys(selectedItems);
        form.setValue('categories', selectedValuesArray);
    };
    const form = useForm<z.infer<typeof PostFormSchema>>({
        resolver: zodResolver(PostFormSchema),
        defaultValues: {
            id: currentPost?.id || '',
            post_type: post_type,
            domain: currentDomain,
            title: currentPost?.title || '',
            content: currentPost?.content || '',
            featuredImage: currentPost?.featuredImage.id || '',
            categories: currentPost?.categories|| []
        },
    });

    async function onSubmit(values: z.infer<typeof PostFormSchema>) {
        const createOrEditPostResponse = await createOrEditPost(values);
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: "Edit Failed" })
        }
        if (createOrEditPostResponse?.code === 200 || createOrEditPostResponse?.code === 201) {
            const updatedPost = createOrEditPostResponse?.data?.post;
            setCurrentPost(updatedPost);
            form.setValue('id', updatedPost?.id);
            const message = createOrEditPostResponse?.code === 200 ? 'Successfully Updated Post' : 'Successfully Created Post';
            navigate('/posts/' + post_type)
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Editor
                                                value={field.value}
                                                onTextChange={(e) => field.onChange({ target: { value: e.htmlValue } })}
                                                style={{ height: '320px' }}
                                                name="content"
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="media_image  w-2/6 flex flex-col gap-8">
                            <div className="card media_image ">
                                <FormField
                                    control={form.control}
                                    name="featuredImage"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Featured Image</FormLabel>
                                            <FormControl>
                                                <MediaPicker
                                                    defaultValue={post?.featuredImage}
                                                    onSelect={(selectedImage) => {
                                                        if (selectedImage) {
                                                            form.setValue('featuredImage', selectedImage.id);
                                                        } else {
                                                            form.setValue('featuredImage', '');
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="categories w-full">
                                <FormField
                                    name="categories"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Select Categories</FormLabel>
                                            <FormControl>
                                                <Tree
                                                    value={categories}
                                                    metaKeySelection={metaKey}
                                                    selectionMode="multiple"
                                                    selectionKeys={selectedKeys}
                                                    onSelectionChange={(e: any) => handleTreeSelectionChange(e.value)}
                                                    className="w-full md:w-30rem"
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                    </div>
                    <Button type="submit" className="shad-button_primary max-w-fit self-end" disabled={isOperating}>
                        {isOperating ? <Loader /> : !currentPost ? 'Create' : 'Update'}
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default PostForm;
