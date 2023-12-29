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
        Will Be Adding a cool dashboard here!!
    </div>

  );
};

export default Home;