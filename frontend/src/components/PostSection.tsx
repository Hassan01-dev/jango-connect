import PostForm from "./posts/PostForm";
import Posts from "./posts/Posts";

export const PostSection = () => {
  return ( 
    <div>
        <h1>Post</h1>
        <PostForm />
        <Posts />
    </div>
  );
}

export default PostSection