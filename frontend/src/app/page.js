// import Image from "next/image";
// import styles from "./page.module.css";
// import NavBar from "@/components/navbar";

// export default function Home() {
//   return <>
//   </>
// }

import { getCurrentUser } from "./actions/auth";
import Link from "next/link";
import styles from "../styles/home.module.css";
import Sidebar from "@/components/sidebar"; 
import { HiChatBubbleLeftRight, HiBell, HiCog6Tooth } from "react-icons/hi2";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className={styles.homePage}>
      {!user ? (
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connect<span className={styles.highlight}>Hub</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with friends, share moments, and build your community.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.primaryButton}>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondaryButton}>
                Log In
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc" alt="ConnectHub" />
          </div>
        </div>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.leftSidebar}>
            <div className={styles.userCard}>
              <div className={styles.userCardHeader}>
                <img
                  src={user.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={user.firstName}
                  className={styles.userCardAvatar}
                />
                <div className={styles.userCardInfo}>
                  <h2 className={styles.userCardName}>
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className={styles.userCardUsername}>
                    @
                    {user.nickname ||
                      `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`}
                  </p>
                </div>
              </div>
              <div className={styles.userCardStats}>
                <div className={styles.userCardStat}>
                  <span className={styles.userCardStatNumber}>
                    {user.posts?.length || 0}
                  </span>
                  <span className={styles.userCardStatLabel}>Posts</span>
                </div>
                <div className={styles.userCardStat}>
                  <span className={styles.userCardStatNumber}>
                    {user.followers?.length || 0}
                  </span>
                  <span className={styles.userCardStatLabel}>Followers</span>
                </div>
                <div className={styles.userCardStat}>
                  <span className={styles.userCardStatNumber}>
                    {user.following?.length || 0}
                  </span>
                  <span className={styles.userCardStatLabel}>Following</span>
                </div>
              </div>
              <Link
                href={`/profile/${user.id}`}
                className={styles.userCardLink}
              >
                View Profile
              </Link>
            </div>

            <div className={styles.sidebarMenu}>
              <Link
                href="/"
                className={`${styles.sidebarMenuItem} ${styles.active}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </Link>
              <Link href="/explore" className={styles.sidebarMenuItem}>
                <HiCompass size={20} />
                Explore
              </Link>

              <Link href="/groups" className={styles.sidebarMenuItem}>
                <HiUserGroup size={20} />
                Groups
              </Link>

              <Link href="/messages" className={styles.sidebarMenuItem}>
                <HiChatBubbleLeftRight size={20} />
                Messages
              </Link>

              <Link href="/notifications" className={styles.sidebarMenuItem}>
                <HiBell size={20} />
                Notifications
              </Link>

              <Link href="/settings" className={styles.sidebarMenuItem}>
                <HiCog6Tooth size={20} />
                Settings
              </Link>
            </div>
          </div>

          <div className={styles.contentArea}>
            <div className={styles.createPost}>
              <div className={styles.createPostHeader}>
                <img
                  src={user.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={user.firstName}
                  className={styles.createPostAvatar}
                />
                <input
                  type="text"
                  placeholder={`What's on your mind, ${user.firstName}?`}
                  className={styles.createPostInput}
                />
              </div>
              <div className={styles.createPostActions}>
                <button className={styles.createPostAction}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Photo/Video
                </button>
                <button className={styles.createPostAction}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Feeling/Activity
                </button>
                <button className={styles.createPostAction}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Location
                </button>
              </div>
            </div>

            <div className={styles.feedToggle}>
              <button className={`${styles.feedToggleButton} ${styles.active}`}>
                For You
              </button>
              <button className={styles.feedToggleButton}>Following</button>
            </div>

            <div className={styles.feed}>
              {/* Sample posts */}
              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="John Doe"
                    className={styles.postAvatar}
                  />
                  <div className={styles.postInfo}>
                    <div className={styles.postUser}>John Doe</div>
                    <div className={styles.postTime}>2 hours ago</div>
                  </div>
                </div>
                <div className={styles.postContent}>
                  <p>
                    Just finished a 10-mile hike in the mountains. The views
                    were breathtaking! 🏔️
                  </p>
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Mountain view"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postActions}>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Like
                  </button>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Comment
                  </button>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Jane Smith"
                    className={styles.postAvatar}
                  />
                  <div className={styles.postInfo}>
                    <div className={styles.postUser}>Jane Smith</div>
                    <div className={styles.postTime}>Yesterday</div>
                  </div>
                </div>
                <div className={styles.postContent}>
                  <p>
                    Check out this amazing sunset I captured yesterday evening.
                    #photography #sunset
                  </p>
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Sunset"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postActions}>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Like
                  </button>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Comment
                  </button>
                  <button className={styles.postAction}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightSidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>People You May Know</h3>
              <div className={styles.suggestionsList}>
                <div className={styles.suggestionItem}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Sarah Williams"
                    className={styles.suggestionAvatar}
                  />
                  <div className={styles.suggestionInfo}>
                    <div className={styles.suggestionName}>Sarah Williams</div>
                    <div className={styles.suggestionMeta}>
                      5 mutual friends
                    </div>
                  </div>
                  <button className={styles.followButton}>Follow</button>
                </div>
                <div className={styles.suggestionItem}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Alex Brown"
                    className={styles.suggestionAvatar}
                  />
                  <div className={styles.suggestionInfo}>
                    <div className={styles.suggestionName}>Alex Brown</div>
                    <div className={styles.suggestionMeta}>
                      2 mutual friends
                    </div>
                  </div>
                  <button className={styles.followButton}>Follow</button>
                </div>
              </div>
              <Link href="/suggestions" className={styles.sidebarCardLink}>
                See All
              </Link>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Suggested Groups</h3>
              <div className={styles.suggestionsList}>
                <div className={styles.suggestionItem}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Photography Enthusiasts"
                    className={styles.suggestionAvatar}
                  />
                  <div className={styles.suggestionInfo}>
                    <div className={styles.suggestionName}>
                      Photography Enthusiasts
                    </div>
                    <div className={styles.suggestionMeta}>1.2k members</div>
                  </div>
                  <button className={styles.followButton}>Join</button>
                </div>
                <div className={styles.suggestionItem}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Hiking Adventures"
                    className={styles.suggestionAvatar}
                  />
                  <div className={styles.suggestionInfo}>
                    <div className={styles.suggestionName}>
                      Hiking Adventures
                    </div>
                    <div className={styles.suggestionMeta}>850 members</div>
                  </div>
                  <button className={styles.followButton}>Join</button>
                </div>
              </div>
              <Link href="/groups/discover" className={styles.sidebarCardLink}>
                See All
              </Link>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Upcoming Events</h3>
              <div className={styles.eventsList}>
                <div className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <div className={styles.eventMonth}>APR</div>
                    <div className={styles.eventDay}>15</div>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventName}>Photography Workshop</div>
                    <div className={styles.eventLocation}>Central Park</div>
                    <div className={styles.eventAttendees}>5 going</div>
                  </div>
                </div>
                <div className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <div className={styles.eventMonth}>APR</div>
                    <div className={styles.eventDay}>22</div>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventName}>Weekend Hike</div>
                    <div className={styles.eventLocation}>
                      Mountain Ridge Trail
                    </div>
                    <div className={styles.eventAttendees}>3 going</div>
                  </div>
                </div>
              </div>
              <Link href="/events" className={styles.sidebarCardLink}>
                See All
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
