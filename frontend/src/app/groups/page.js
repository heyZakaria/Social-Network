// import { getCurrentUser } from "@/actions/auth"
import GroupsComponent from "@/components/groups/groups-component";
import db from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function GroupsPage() {
  // const currentUser = await getCurrentUser()
  const currentUser = {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  };
  if (!currentUser) {
    // This should be handled by middleware, but just in case
    return notFound();
  }

  // Get user's groups
  const userGroups = db.groups.findByMemberId(currentUser.id);

  // Get group suggestions
  const groupSuggestions = db.groups.getSuggestions(currentUser.id);

  return (
    <GroupsComponent
      currentUser={currentUser}
      userGroups={userGroups}
      groupSuggestions={groupSuggestions}
    />
  );
}
