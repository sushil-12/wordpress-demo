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
import { useCreateOrEditPost } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { PostModel } from "@/lib/types";
import { useState } from "react";
import { useUserContext } from "@/context/AuthProvider";

interface PostFormSchema {
    post_type: string | undefined,
    post: PostModel|undefined,
}
const PostForm: React.FC<PostFormSchema> = ({ post_type, post }) => {
    const { mutateAsync: createOrEditPost, isPending: isOperating } = useCreateOrEditPost();
    const [currentPost, setCurrentPost] = useState<PostModel | undefined>(post);
    const {currentDomain} = useUserContext();

    const { toast } = useToast();
    const form = useForm<z.infer<typeof PostFormSchema>>({
        resolver: zodResolver(PostFormSchema),
        defaultValues: {
            id: currentPost?.id || '',
            post_type: post_type,
            domain:currentDomain,
            title: currentPost?.title || '',
            content: currentPost?.content || '',
            featured_image: currentPost?.featuredImage || '',
          },
      });
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostFormSchema>) {
        const createOrEditPostResponse = await createOrEditPost(values);
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: "Edit Failed" })
        }
        if (createOrEditPostResponse?.code === 200 || createOrEditPostResponse?.code === 201) {
            const updatedPost = createOrEditPostResponse?.data?.post;
            setCurrentPost(updatedPost); 
            form.setValue('id', updatedPost?.id);

            console.log(currentPost, form.getValues())
            const message = createOrEditPostResponse?.code === 200 ? 'Successfully Updated Post': 'Successfully Created Post';
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
                        <Card className="media_image w-2/6 p-4 max-h-fit">
                            <FormField
                                control={form.control}
                                name="featured_image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Featured Image</FormLabel>
                                        <FormControl>
                                            <MediaPicker onSelect={(selectedImage) => {
                                                form.setValue('featured_image', selectedImage.id)
                                            }} />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />

                        </Card>
                    </div>
                    <Button type="submit" className="shad-button_primary max-w-fit align-end" disabled={isOperating}>
                        {isOperating ? <Loader /> : 'Create Post'}
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default PostForm;
