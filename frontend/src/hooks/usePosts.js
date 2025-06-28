import { useState, useEffect } from "react";

export default function usePosts(
  { groupId, limit, ProfileId } = { groupId: null, limit: 10, ProfileId: null }
) {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // for pagination
  const [refrech, setRefrech] = useState(0);
  useEffect(() => {
    async function x() {
      const GroupQuery = ProfileId ? `&user_id=${ProfileId}` : "";
      const ProfileQuery = groupId ? `&group_id=${groupId}` : "";
      const response = await fetch(
        `/api/posts/getposts?limit=${limit}&offset=${offset}${GroupQuery}${ProfileQuery}`
      );
      const data = await response.json();
    
      if (data?.data?.posts?.length < limit) {
        setHasMore(false); // no more posts
      }
      
      setPosts((prev) => {
        let combinedPosts = [...prev];
        const existingIds = new Set(prev.map((p) => p.PostId));
        const uniqueNewPosts = data?.data?.posts?.filter(
          (p) => !existingIds.has(p.PostId)
        );
        if (uniqueNewPosts?.length === 0) {
          return prev; // No new posts, return previous state
        }
        combinedPosts = [...prev, ...(uniqueNewPosts || [])];

        // Sort posts from highest PostId to lowest
        combinedPosts.sort((a, b) => b.PostId - a.PostId);

        return combinedPosts;
      });

      setLoading(false);
    }
    setLoading(true); // TODO WAiting before setting it true
    x();
  }, [refrech, offset, groupId, ProfileId, limit]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + limit);
    }
  };
  function RefrechPosts() {
    //reseting all States to initial state
    setRefrech((prev) => prev + 1);
    setPosts([]);
    setHasMore(true);
    setOffset(0);
  }

  return {
    posts,
    loading,
    hasMore,
    loadMore,
    RefrechPosts,
  };
}
