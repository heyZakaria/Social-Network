"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "../../styles/groups.module.css"
import CreateGroupModal from "./create-group-modal"

export default function GroupsComponent({ currentUser, userGroups, groupSuggestions }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("my-groups")

  return (
    <div className={styles.groupsContainer}>
      <div className={styles.groupsHeader}>
        <h1>Groups</h1>
        <button className={styles.createGroupButton} onClick={() => setShowCreateModal(true)}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Group
        </button>
      </div>

      <div className={styles.groupsTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "my-groups" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("my-groups")}
        >
          My Groups
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "discover" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "invitations" ? styles.activeTab : ""}`}
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
                <Link href={`/groups/${group.id}`} key={group.id} className={styles.groupCard}>
                  <div className={styles.groupCardImage}>
                    <img src={group.image || "/placeholder.svg?height=150&width=300"} alt={group.name} />
                  </div>
                  <div className={styles.groupCardContent}>
                    <h3 className={styles.groupCardTitle}>{group.name}</h3>
                    <p className={styles.groupCardMembers}>{group.members.length} members</p>
                    {group.creatorId === currentUser.id && <span className={styles.adminBadge}>Admin</span>}
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h2>You haven't joined any groups yet</h2>
                <p>Discover groups or create your own</p>
                <button className={styles.emptyStateButton} onClick={() => setActiveTab("discover")}>
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
                    <img src={group.image || "/placeholder.svg?height=150&width=300"} alt={group.name} />
                  </div>
                  <div className={styles.groupCardContent}>
                    <h3 className={styles.groupCardTitle}>{group.name}</h3>
                    <p className={styles.groupCardMembers}>{group.members.length} members</p>
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
            setShowCreateModal(false)
            setActiveTab("my-groups")
          }}
        />
      )}
    </div>
  )
}
