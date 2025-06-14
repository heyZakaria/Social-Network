"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/groups.module.css";
import CreateGroupModal from "./create-group-modal";
import Image from "next/image";
import { HiPlus, HiUserGroup } from "react-icons/hi2";
import FloatingChat from "@/components/chat/floating-chat";

export default function GroupsComponent({
  currentUser,
  userGroups,
  groupSuggestions,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("my-groups");

  currentUser = {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "/uploads/profile.jpeg0",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  };
  return (
    <div className={styles.groupsContainer}>
      <div className={styles.groupsHeader}>
        <h1>Groups</h1>
        <button
          className={styles.createGroupButton}
          onClick={() => setShowCreateModal(true)}
        >
          <HiPlus size={20} />
          Create Group
        </button>
      </div>

      <div className={styles.groupsTabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "my-groups" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("my-groups")}
        >
          My Groups
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "discover" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "invitations" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("invitations")}
        >
          Invitations
        </button>
      </div>

      <div className={styles.groupsContent}>
        {activeTab === "my-groups" && (
          <div className={styles.groupsGrid}>
            {userGroups.length > 0 ? (
              userGroups.map((group) => (
                <Link
                  href={`/groups/${group.id}`}
                  key={group.id}
                  className={styles.groupCard}
                >
                  <div className={styles.groupCardImage}>
                    <Image width={200} height={100}
                      src={
                        group.image || "/placeholder.svg?height=150&width=300"
                      }
                      alt={group.name}
                    />
                  </div>
                  <div className={styles.groupCardContent}>
                    <h3 className={styles.groupCardTitle}>{group.name}</h3>
                    <p className={styles.groupCardMembers}>
                      {group.members.length} members
                    </p>
                    {group.creatorId === currentUser.id && (
                      <span className={styles.adminBadge}>Admin</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <HiUserGroup size={48} />
                </div>
                <h2>You haven't joined any groups yet</h2>
                <p>Discover groups or create your own</p>
                <button
                  className={styles.emptyStateButton}
                  onClick={() => setActiveTab("discover")}
                >
                  Discover Groups
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "discover" && (
          <div className={styles.groupsGrid}>
            {groupSuggestions.length > 0 ? (
              groupSuggestions.map((group) => (
                <div key={group.id} className={styles.groupCard}>
                  <div className={styles.groupCardImage}>
                    <Image width={200} height={100}
                      src={
                        group.image || "/placeholder.svg?height=150&width=300"
                      }
                      alt={group.name}
                    />
                  </div>
                  <div className={styles.groupCardContent}>
                    <h3 className={styles.groupCardTitle}>{group.name}</h3>
                    <p className={styles.groupCardMembers}>
                      {group.members.length} members
                    </p>
                    <button className={styles.joinButton}>Join Group</button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No group suggestions available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "invitations" && (
          <div className={styles.invitationsList}>
            <div className={styles.emptyState}>
              <p>No pending invitations</p>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={(newGroup) => {
            // In a real app, we would update the groups list
            setShowCreateModal(false);
            setActiveTab("my-groups");
          }}
        />
      )}
      <FloatingChat currentUser={currentUser} />
    </div>
  );
}
