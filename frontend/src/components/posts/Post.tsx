import { Card, CardContent } from '@/components/ui/card';

interface PostProps {
  post: {
    uuid: string;
    content: string;
    media?: string[];
    likes_count: number;
    comments_count: number;
  };
}

const Post = ({ post }: PostProps) => {
  return (
    <Card className="shadow">
      <CardContent className="p-4">
        <p className="mb-2">{post.content}</p>

        {Array.isArray(post.media) && post.media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {post.media.map((imageUrl, idx) => (
              <img
                key={idx}
                src={imageUrl}
                alt={`Post Media ${idx + 1}`}
                className="rounded object-cover w-full h-40"
              />
            ))}
          </div>
        )}

        <div className="text-sm text-muted-foreground mt-2">
          {post.likes_count} Likes · {post.comments_count} Comments
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;