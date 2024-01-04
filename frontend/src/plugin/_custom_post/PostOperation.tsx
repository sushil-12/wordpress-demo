import PostForm from "@/plugin/_custom_form/PostForm";
import Header from "@/components/ui/header";
import { useParams } from "react-router-dom";
import { formatString } from "@/lib/utils";
import { useState, useEffect } from "react";
import { PostModel } from "@/lib/types";
import { usegetPostbyID } from "@/lib/react-query/queriesAndMutations";

const PostOperation = () => {
  const { post_type, post_id } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);
  const { mutateAsync: getPostByID, isPending: isLoading } = usegetPostbyID();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (post_id) {
          const response = await getPostByID(post_id);
          setPost(response?.data?.post);
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchPost();
  }, [getPostByID, post_id]);

  const formattedPostType = post_type ? formatString(post_type) : "";
  console.log(post)
  return (
    <div className="common-container h-100">
      <Header title={`Manage ${formattedPostType}`} />
      {post && <PostForm post_type={post_type} post={post} />}
    </div>
  );
};

export default PostOperation;
