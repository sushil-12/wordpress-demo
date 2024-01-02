import PostForm from "@/plugin/_custom_form/PostForm";
import Header from "@/components/ui/header";
import { useParams } from "react-router-dom";
import { formatString } from "@/lib/utils";

const PostOperation = () => {
  const { post_type, post_id } = useParams();
  console.log(post_id)

  // Will be adding an API for the same currently initilaising it as an UNDEFINED
  const post=undefined;
  const formattedPostType = post_type ? formatString(post_type) : ""; // Provide a default value

  return (
    <div className="common-container h-100">
      <Header title={`Manage ${formattedPostType}`} />
      <PostForm post_type={post_type} post={post}/>
    </div>
  );
};

export default PostOperation;