"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ShowEventForm from "@/components/events/newEvent";
import CreatePost from "@/components/posts/create-post";
import Link from "next/link";
import PostFeeds from "@/components/posts/posts-feed";
import usePosts from "@/hooks/usePosts";
import PendingInviteList from "@/components/Group/PendingInvites";
import { FiUserPlus, FiUsers, FiCalendar } from "react-icons/fi";
import UpcomingEvents from "@/components/events/upcoming-events";
import styles from './GroupCard.module.css';
import InviteFriends from "@/components/Group/InviteFriends";
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp, IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Image from "next/image";
import FloatingChat from "@/components/chat/floating-chat";
import { useUser } from "@/context/user_context";
import { TrimName } from "@/components/groups/group-suggestions";



function isMember(DummyTest) {
  // TODO : Need To Check if the user is a Member
  return DummyTest;
}

function GroupNav({ OnMembers, HandleShowInvite, HandleShowEvents }) {
  const [joinRequest, setJoinRequest] = useState(false);
  const p = useParams();
  const groupId = p.id;

  let nav = (
    <div className={styles.groupNav}>
      <button
        onClick={async (e) => {
          e.preventDefault();
          try {
            // TODO: Should Fetch To InviteEndpoint
          } catch (error) {
            console.log(error);
          }
          setJoinRequest(!joinRequest);
        }}
      >
        {!joinRequest ? "Join" : "Pending"}
      </button>
    </div>
  );

  const router = useRouter();
  const handleEvents = (e) => {
    e.preventDefault();
  };

  if (isMember(true)) {
    nav = (
      <div className={styles.groupNav}>
        <button onClick={HandleShowInvite} className={styles.navIcon}>
          <FiUserPlus size={20} />
        </button>
        <button onClick={OnMembers} className={styles.navIcon}>
          <FiUsers size={20} />
        </button>
        <button onClick={HandleShowEvents} className={styles.navIcon}>
          <FiCalendar size={20} />
        </button>
      </div>
    );
  }

  return nav;
}

function Members({ members, groupId }) {
  const [current, setCurrent] = useState(0);

  let paginatedMembers = members;
  if (members.length > 3) {
    paginatedMembers = members.slice(current, current + 3);
  }

  if (!members || members.length === 0) return <p>No members found.</p>;

  return (
    <div className={styles.membersNavigationWrapper}>
      <button
        className={styles.paginationButton}
        onClick={() => current > 0 && setCurrent((prev) => prev - 3)}
        disabled={current <= 0}
      >
        <IoChevronBackCircleSharp />
      </button>
      <ul className={styles.membersList} id={groupId}>
        {paginatedMembers.map((member) => (
          <li key={member.User_id} className={styles.memberItem}>
            <Link href={`/profile/${member.User_id}`}>
              <p>{`${member.FirstName} ${member.LastName}`}</p>
              <img
                className={styles.memberImage}
                src={
                  member.Avatar
                    ? `/uploads/profile_image/${member.Avatar}`
                    : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                }
                alt={`${member.FirstName} ${member.LastName}`}
              />
              <p>{member.Role}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button
        className={styles.paginationButton}
        onClick={() =>
          current + 3 < members.length && setCurrent((prev) => prev + 3)
        }
        disabled={current + 3 >= members.length}
      >
        <IoChevronForwardCircleSharp />
      </button>
    </div>
  );
}

function Description({ Text }) {
  return <p className={styles.description}>{Text}</p>;
}

export default function GroupCard({ children }) {
  const [group, setGroup] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState();
  const [showMembers, setShowMembers] = useState(false);

  const { user: currentUser } = useUser();
  const p = useParams();
  const groupId = p.id;
  const { posts, loadingPosts, hasMore, loadMore, RefrechPosts } = usePosts({
    groupId: groupId,
    limit: 10,
  });

  const handleInvite = async (id) => {
    try {
      const respo = await fetch(
        `http://localhost:8080/api/groups/invite?Invited_id=${id}&Group_id=${groupId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!respo.ok) throw new Error("Something Happened, Try Again");
      const Data = await respo.json();
      setInvitedFriends((prev) => prev.filter((friend) => friend.id !== id));
    } catch (error) {
      setErr(error.message);
    }
  };

  const HandleShowInvite = async () => {
    if (!showInvite) {
      try {
        const resp = await fetch(
          `http://localhost:8080/api/groups/group/FriendList?id=${groupId}`,
          { credentials: "include" }
        );
        if (!resp.ok) throw new Error("Something Happened, Try Again");
        const Data = await resp.json();
        setInvitedFriends(Data.data);
        setShowInvite(true);
        if (showMembers) setShowMembers(false);
      } catch (error) {
        setErr(error.message);
      }
    } else {
      setShowInvite(!showInvite);
    }
    if (showMembers) setShowMembers(!showMembers);
  };

  const HandleMembersList = async () => {
    if (!showMembers) {
      try {
        const resp = await fetch(
          `http://localhost:8080/api/groups/group/members?id=${groupId}`,
          { credentials: "include" }
        );
        if (!resp.ok) throw new Error("Something Happened, Try Again");
        const Data = await resp.json();
        setMembers(Data.data);
        setShowMembers(true);
        if (showInvite) setShowInvite(false);
      } catch (error) {
        setErr(error.message);
      }
    } else {
      setShowMembers(!showMembers);
    }
  };

  const HandleShowEvents = () => {
    setShowEvents(!showEvents);
    setShowInvite(false);
    setShowMembers(false);
  };

  useEffect(() => {
    if (!groupId) return;
    fetch(`http://localhost:8080/api/groups/group/?id=${groupId}`, {
      credentials: "include",
      method: "GET",
    })
      .then(async (res) => {
        const Data = await res.json();
        console.log("DATA of GROUP", Data.data, "===============");
        setGroup(Data.data);

        console.log("group after set", group);
        console.log("Data.data", Data.data);

        if (!res.ok) throw new Error(Data.message);
      })
      .catch((error) => {
        setErr(error.message);
      });
    setLoading(false);
  }, [groupId]);

  if (loading) return <p>Data is Loading</p>;
  if (err !== null) return <p>{err}</p>;

  const groupInfo = {
    id: group?.id,
    title: group?.title,
    covername: group?.covername,
    description: group?.description,
  }

  return (
    <div>
      <div id={group.id} className={styles.groupCardContainer}>
        <GroupNav
          HandleShowInvite={HandleShowInvite}
          HandleShowEvents={HandleShowEvents}
          OnMembers={HandleMembersList}
          FriendsList={invitedFriends}
        />
        <img
          src={group.covername ? `/uploads/groups_cover/${group.covername}` : `/uploads/groups_cover/anonymous-hideous-facebook-cover.jpg` }

          alt={group.title}
          className={styles.groupCover}
        />
      </div>
      <div id={group.id} className={styles.GroupCardContainer}>
        <div className={styles.GroupCardHeader}>
          <div className={styles.GroupCardHeaderContent}>
            <Link href="/groups" className={styles.backButton}>
              <IoChevronBackCircleSharp size={30} />
            </Link>
            <h1 className={styles.GroupCardTitle}>{group.title ?  TrimName(group.title) : null}</h1>
          </div>
          <div className={styles.GroupChatButton}>
            <FloatingChat currentUser={currentUser} source={"group"} group={groupInfo} />
          </div>
        </div>
      <Description Text={group.description} />

      <CreatePost Refrech={RefrechPosts} GroupId={groupId} currentUser={currentUser} />

      {showMembers && <Members members={members} />}
      {children}
      {showInvite && (
        <InviteFriends FriendsList={invitedFriends} onInvite={handleInvite} />
      )}
      {showEvents && <ShowEventForm />}
      {<UpcomingEvents group_id={p.id} />}
      <PostFeeds
        posts={posts}
        loading={loadingPosts}
        loadMore={loadMore}
        hasMore={hasMore}
        currentUser={currentUser}
      />
      <PendingInviteList groupId={groupId} />
    </div>
    </div>
  );
}