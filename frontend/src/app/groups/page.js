import { getCurrentUser } from "@/actions/auth"
import GroupsComponent from "@/components/groups/groups-component"
import db from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default async function GroupsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    // This should be handled by middleware, but just in case
    return notFound()
  }

  // Get user's groups
  const userGroups = db.groups.findByMemberId(currentUser.id)

  // Get group suggestions
  const groupSuggestions = db.groups.getSuggestions(currentUser.id)

  return <GroupsComponent currentUser={currentUser} userGroups={userGroups} groupSuggestions={groupSuggestions} />
}
