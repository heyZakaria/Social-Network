import { getCurrentUser } from "@/actions/auth"
import ProfileComponent from "@/components/profile/profile-component"
import db from "@/lib/mock-data"

import { notFound } from "next/navigation"

export default async function ProfilePage({ params }) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return notFound()
    }

    const userId = parseInt(params.id, 10)
    const profileUser = db.users.findById(userId)
    
    if (!profileUser) {
      return notFound()
    }

    // Get user data from mock DB
    const posts = db.posts.findByUserId(userId)
    const followers = db.users.getFollowers(userId)
    const following = db.users.getFollowing(userId)

    return (
      <ProfileComponent
        currentUser={currentUser}
        profileUser={profileUser}
        canView={currentUser.id === profileUser.id || profileUser.isPublic}
        posts={posts}
        followers={followers}
        following={following}
      />
    )
  } catch (error) {
    console.error("Profile page error:", error)
    return notFound()
  }
}