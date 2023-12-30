
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { mediaEditFormSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast"
import { useEditMedia } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { MediaItem } from "@/lib/types";
import { useEffect  } from "react";
import { useMedia } from "@/context/MediaProvider";

const MediaEditForm: React.FC<{ item: MediaItem, handleModal:any }> = ({ item, handleModal }) => {

    const form = useForm<z.infer<typeof mediaEditFormSchema>>({
        resolver: zodResolver(mediaEditFormSchema),
        defaultValues: {
            id: item?.id,
            caption: item?.caption,
            alt_text: item?.alt_text,
            description: item?.description,
            filename: item?.filename,
            category: item?.category,
            tags: item?.tags,
            title: item?.title,
        },
    });

    useEffect(() => {
        form.setValue('id', item?.id);
        form.setValue('caption', item?.caption);
        form.setValue('alt_text', item?.alt_text);
        form.setValue('description', item?.description);
        form.setValue('filename', item?.filename);
        form.setValue('category', '');
        form.setValue('tags', '');
        form.setValue('title', item?.title);
    }, [item, form]);
    const { toast } = useToast()
    const { mutateAsync: editMedia, isPending: isUpdatingMedia } = useEditMedia();
    const {media, setMedia} = useMedia();

    async function onSubmit(values: z.infer<typeof mediaEditFormSchema>) {
        const editMediaResponse = await editMedia(values);
        const updatedItems = media.map(item =>
            item.id === item?.id ? editMediaResponse.data?.media : item
        );
        setMedia(updatedItems);
        if (!editMediaResponse) {
            return toast({ variant: "destructive", title: "Edit Failed", description: "Something went wrong" })
        }
        if (editMediaResponse?.code == 200) {
            handleModal()
            return toast({ variant: "default", title: "Edit Media", description: 'Media Updated Successfuly' })
        } else {
            handleModal()
            return toast({ variant: "default", title: "Edit Media", description: 'Media Updated Successfuly' })
        }
    }

    return (
        <Form {...form}>
            <div className="">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-3 w-full mt-4"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add title" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="caption" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Enter Caption" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="filename" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filename</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add filename" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="alt_text" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternative Text</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add Alternative text" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                    </div>

                    {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add category" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add tags" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                    </div> */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea className="shad-input" placeholder="Add description" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                    </div>


                    <Button type="submit" className="shad-button_primary w-1/2 place-self-end ">
                        {isUpdatingMedia ? (
                            <div className="flex-center gap-2">
                                <Loader />
                            </div>
                        ) : (
                            "Update Media Item"
                        )}
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default MediaEditForm;
