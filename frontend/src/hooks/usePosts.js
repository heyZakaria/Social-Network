import { useState , useEffect } from "react";
import { FetchData } from "@/context/fetchJson";

export default function usePosts({groupId , limit , ProfileId}={groupId : null , limit : 10 , ProfileId:null}){
 const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // for pagination
    const [refrech, setRefrech] = useState(0);
    useEffect(() => {
      async function x() {
        const GroupQuery = ProfileId ? `&user_id=${ProfileId}` : ""
        const ProfileQuery = groupId  ? `&group_id=${groupId}` : ""
        const data = await FetchData(
        `/api/posts/getposts?limit=${limit}&offset=${offset}${GroupQuery}${ProfileQuery}`
      );
      if (data.data.posts.length < limit) {
        console.log("no more posts", data.data.posts.length);
        console.log("no more posts", data.data.posts);

        setHasMore(false); // no more posts
      }
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.PostId));
        const uniqueNewPosts = data.data.posts.filter(
          (p) => !existingIds.has(p.PostId)
        );
        const combinedPosts = [...prev, ...uniqueNewPosts];
      
        // Sort posts from highest PostId to lowest
        combinedPosts.sort((a, b) => b.PostId - a.PostId);
      
        return combinedPosts;
      });
      
      setLoading(false);
    }
    setLoading(true); // TODO WAiting before setting it true
      x();
    
  }, [refrech ,offset , groupId]);

  console.log("posts", posts);
  console.log("hasMore", hasMore);

  const loadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + limit);
    }
  };
  function RefrechPosts() {
    // TODO Fix adding posts without reloading the page
    //reseting all States to initial state
    setRefrech((prev) => prev + 1);
    setPosts([])
    setHasMore(true)
    setOffset(0)
  }

  
  return {
posts,
loading,
hasMore,
loadMore,
RefrechPosts,
  }

}