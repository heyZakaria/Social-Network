"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/home.module.css";
import { BsImage } from "react-icons/bs";
import { MdOutlineMood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PostComponent from "@/components/posts/post-component";
import FloatingChat from "@/components/chat/floating-chat";
import { FetchData } from "@/app/(utils)/fetchJson";
import { useUser } from "@/app/(utils)/user_context";
import CreatePost from "@/components/posts/create-post";
// import { getCurrentUser } from "@/app/(auth)/(utils)/api"


export default function Home() {

    const { user } = useUser;
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 10; // You can change this value if needed
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // for pagination

    useEffect(() => {
        async function x() {
            const data = await FetchData(`http://localhost:8080/posts/getposts?limit=${limit}&offset=${offset}`)
            if (data.data.posts.length < limit) {
                console.log("no more posts", data.data.posts.length);
                console.log("no more posts", data.data.posts);

                setHasMore(false); // no more posts
            }
            setPosts((prev) => {
                const existingIds = new Set(prev.map((p) => p.PostId));
                const uniqueNewPosts = data.data.posts.filter((p) => !existingIds.has(p.PostId));
                return [...prev, ...uniqueNewPosts];
            });
            setLoading(false);
        }
        setLoading(true); // TODO WAiting before setting it true
        x()
    }, [offset]);

    console.log("posts", posts);
    console.log("hasMore", hasMore);


    const loadMore = () => {
        if (!loading && hasMore) {
            setOffset((prev) => prev + limit);
        }
    };
    // TODO JUST FOR TESTING MAKE IT DYNAMIC

    // const current = await getCurrentUser()
    // 

    // if (!currentUser) {
    //   // This should be handled by middleware, but just in case
    //   return notFound()
    // }
    const currentUser = {
        id: 1,
        avatar: "",
        firstName: "test",
        lastName: "test",
    };
    return (
        <div className={styles.homePage}>
            <div className={styles.mainContent}>
                <CreatePost />
                <div className={styles.contentArea}>
                    <div className={styles.feed}>
                        {loading && posts.length === 0 ? (
                            <p>Loading...</p>
                        ) : posts.length > 0 ? (
                            <>
                                {posts.map((post) => (
                                    <PostComponent
                                        key={post.PostId}
                                        post={post}
                                        user={user} // or actual logged in user
                                        currentUser={user}
                                    />
                                ))}

                                {hasMore && (
                                    <button
                                        className={styles.loadMoreButton}
                                        onClick={loadMore}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Load More"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No posts yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* </div> */}
            <FloatingChat currentUser={currentUser} />
        </div>
    );


}
