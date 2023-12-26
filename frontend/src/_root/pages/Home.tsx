import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postValidationSchema as PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const Home = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
 
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });



  return (
    <div className="common-container h-100">
<Form {...form}>
      <form
        className="flex flex-col gap-9 w-full  max-w-5xl">

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          
        </div>
      </form>
    </Form>
    </div>
    
  );
};

export default Home;