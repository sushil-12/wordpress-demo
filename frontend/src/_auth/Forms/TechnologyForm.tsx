import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { technologyFormSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { Editor } from "primereact/editor";
import MediaPicker from "@/components/shared/MediaPicker";
import { Card } from "primereact/card";


const TechnologyForm = () => {

    const { toast } = useToast()
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof technologyFormSchema>>({
        resolver: zodResolver(technologyFormSchema),
        defaultValues: {
            title: "",
            description: "",
            featured_image: ''
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof technologyFormSchema>) {
        console.log(values)
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Editor
                                                value={field.value}
                                                onTextChange={(e) => field.onChange({ target: { value: e.htmlValue } })}
                                                style={{ height: '320px' }}
                                                name="description"
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured Image</FormLabel>
                                        <FormControl>
                                            {/* Use the custom MediaPicker component */}
                                            <MediaPicker onSelect={(selectedImage) => {
                                                // Assuming selectedImage is an object with 'id' property
                                                // Handle the selected image ID (e.g., update the form state)
                                                form.setValue('featured_image', selectedImage.id)
                                            }} />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />

                        </Card>
                    </div>
                    <Button type="submit" className="shad-button_primary max-w-fit align-end">
                        Create Post
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default TechnologyForm;
