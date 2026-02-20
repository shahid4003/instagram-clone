import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { feedPosts } from "../utils/getPost";
import PostCard from "./PostCard";
import useFetch from "../hooks/UseFetch";

const Feedposts = () => {
  const { ref, inView } = useInView();
  const { data: user } = useFetch({ url: "/user/me" });
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = "" }) =>
      feedPosts({ take: 7, lastCursor: pageParam }),
    queryKey: ["posts"],
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading feed.</div>;
  }

  // Flatten all pages data into a single array
  const allPosts = data?.pages?.flatMap((page) => page.data) || [];

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 md:space-y-6">
      {allPosts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No posts available</div>
      ) : (
        allPosts.map((post, index) => {
          if (allPosts.length === index + 1) {
            return (
              <div ref={ref} key={post.id}>
                <PostCard post={post} user={user?.user} />
              </div>
            );
          } else {
            return <PostCard post={post} key={post.id} user={user?.user} />;
          }
        })
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Feedposts;
