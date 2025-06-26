
import PostComponent from "@/components/posts/post-component";
import styles from "@/styles/home.module.css";

export default function PostFeeds({posts , loading , hasMore , loadMore  , currentUser ,GroupId}){
return (
  <div className={styles.mainContent}>
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
                        user={currentUser} // or actual logged in user
                        currentUser={currentUser}
                        GroupId={GroupId}
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
                    <p style={
                      { color: "#7c3aed",
                        textAlign: "center" ,
                        fontSize: "18px",
                        fontWeight: "600",
                        padding: "20px",
                        backgroundColor: "white"
                      }
                    }>No posts yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
)
}
         