import { useEffect, useRef, useState } from 'react';
import { useGetPostsQuery } from '@/store/postsApi';
import { Loader } from 'lucide-react';
import Post from './Post';

export const Posts = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useGetPostsQuery({ page, limit: 5 });

  const posts = data?.data || [];
  const { currentPage, totalPages } = data?.pagination || {};

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prev) => [...prev, ...posts]);
    }

    if (
      typeof currentPage === 'number' &&
      typeof totalPages === 'number' &&
      currentPage >= totalPages
    ) {
      setHasMore(false);
    }
  }, [posts, currentPage, totalPages]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (!container || isFetching || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setPage((prev) => prev + 1);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isFetching, hasMore]);

  if (isError) {
    return <div className="text-red-500">Failed to load posts.</div>;
  }

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-6 overflow-y-scroll h-[65vh] pr-2"
    >
      {allPosts.map((post) => (
        <Post key={post.uuid} post={post} />
      ))}

      {isFetching && (
        <div className="flex justify-center items-center py-6">
          <Loader className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Posts;
