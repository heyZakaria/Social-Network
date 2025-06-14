"use client"
import { useState, useEffect } from "react";
import styles from './GroupCard.module.css';
import InviteFriends from "@/components/group/InviteFriends";
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp } from "react-icons/io5";
import { useParams } from "next/navigation";
import Image from "next/image";


function isMember(DummyTest) {
  // Need To Check if the user is a Member
  return DummyTest;
}

function GroupNav({ OnMembers, HandleShowInvite }) {
  const [JoinRequest, setJoinRequest] = useState(false);

  let Nav = (
    <div className={styles.GroupNav}>
      <button
        onClick={async (e) => {
          e.preventDefault();
          try {
            // -----> Should Fetch To InviteEndpoint
            // const Resp = await fetch()
          } catch (error) {
            console.log(error);
          }
          setJoinRequest(!JoinRequest);
        }}
      >
        {!JoinRequest ? "Join" : "Pending"}
      </button>
    </div>
  );

  if (isMember(true)) {
    Nav = (
      <div className={styles.GroupNav}>
        <a href="#" onClick={() => { HandleShowInvite() }}>Invite Friends</a>
        <a href="#" onClick={() => { OnMembers() }}>Members</a>

        <a href="#" onClick={() => { console.log("DisplayEVents") }}>Events</a>

      </div>
    );
  }

  return Nav;
}

function Members({ members }) {
  const [Current, setCurrent] = useState(0)
  const [PaginatedMembers, setPaginatedMembers] = useState(members.slice(Current, Current + 3))
  useEffect(() => {


    setPaginatedMembers(members.slice(Current, Current + 3));
  }, [Current, members]);

  const MembersList = (
    <ul className={styles.membersList}>
      {PaginatedMembers.map((member) => (

        <li key={member.id} className={styles.memberItem}>
          <p>{member.name}</p>
          <Image width={200} height={100}
            className={styles.memberImage}
            src={member.picture || "https://cdn1.iconfinder.com/data/icons/fillio-users-and-hand-gestures/48/person_-_man_2-512.png"}
            alt={member.name}
          />

        </li>
      ))}
    </ul>


  );

  return (
    <div className={styles.membersNavigationWrapper}>
      <button
        className={styles.paginationButton}
        onClick={() => {
          if (Current > 0) {
            setCurrent(prev => prev - 3);
          }
        }}
        disabled={Current <= 0}
      >
        <IoChevronBackCircleSharp />
      </button>

      <ul className={styles.membersList}>
        {PaginatedMembers.map((member) => (

          <li key={member.id} className={styles.memberItem}>
            <Image width={200} height={100}
              className={styles.memberImage}
              src={member.picture || "https://cdn1.iconfinder.com/data/icons/fillio-users-and-hand-gestures/48/person_-_man_2-512.png"}
              alt={member.name}
            />
            <p>{member.name}</p>
          </li>
        ))}
      </ul>

      <button
        className={styles.paginationButton}
        onClick={() => {
          if (Current + 3 < members.length) {
            setCurrent(prev => prev + 3);
          }
        }}
        disabled={Current + 3 >= members.length}
      >
        <IoChevronForwardCircleSharp />
      </button>

    </div>
  );

}





function Description({ Text }) {
  return <p className={styles.Description}>{Text}</p>;
}



export default function GroupCard({ children }) {
  const [group, setGroup] = useState([])
  const [err, SetErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ShowInvite, setShowInvite] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState(
    FriendsList1.map(friend => ({ ...friend, invited: false }))
  );

  const handleInvite = (id) => {
    setInvitedFriends(prevInvite =>
      prevInvite.map(friend =>
        friend.Id === id ? { ...friend, invited: !friend.invited } : friend
      )
    );
  };


  const HandleShowInvite = () => {
    setShowInvite(prev => !prev)
    if (ShowMembers) {
      setShowMembers(!ShowMembers)

    }
  }

  const [ShowMembers, setShowMembers] = useState(false)

  const HandleMembersList = () => {
    setShowMembers(!ShowMembers)
    if (ShowInvite) {
      setShowInvite(prev => !prev)
    }

    console.log("toggled Members");

  }

  const p = useParams()
  const groupId = p.id
  console.log("groupId:", groupId);

  useEffect(() => {

    if (!groupId) return
    fetch(`http://localhost:8080/api/groups/group/?id=${groupId}`,
      {
        credentials: "include",
        method: "GET",
      }
    ).
      then(async (res) => {

        const Data = await res.json()
        console.log(Data.data, "===============");
        setGroup(Data.data)

        console.log(group);


        if (!res.ok) { throw new Error(Data.message) }
      }).
      then(Data => {
        console.log(Data)
      }).catch(error => {
        SetErr(error.message)
      })
    setLoading(false)
  }, [groupId])
  console.log(`../../public/uploads/${group.covername}`);

  if (loading) return <p>Data is Loading</p>
  if (err !== null) return <p>{err}</p>
  return (

    <div id={group.id} className={styles.GroupCardContainer}>
      <Image width={200} height={100} src={`/uploads/groups_cover/${group.covername}`}
        alt={group.title}/>
      <h1 className={styles.groupTitle}>{group.title}</h1>
      <Description Text={group.description} />
      <GroupNav HandleShowInvite={HandleShowInvite} OnMembers={HandleMembersList} FriendsList={FriendsList1}></GroupNav>
      {ShowMembers && <Members members={members} />}
      {children}
      {ShowInvite && <InviteFriends FriendsList={invitedFriends} onInvite={handleInvite}></InviteFriends>}
    </div>

  )
}
const FriendsList1 = [
  {
    Id: 1,
    name: "John Doe",
    Pic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    Id: 2,
    name: "Jane Smith",
    Pic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    Id: 3,
    name: "Alice Johnson",
    Pic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    Id: 4,
    name: "Michael Brown",
    Pic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    Id: 5,
    name: "Emily Davis",
    Pic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    Id: 6,
    name: "Chris Lee",
    Pic: "https://randomuser.me/api/portraits/men/6.jpg",
  }
];

const groupCardData = {
  groupName: "React Enthusiasts",
  description: "A community of developers passionate about building with React.",
  members: [
    {
      id: 1,
      name: "Alice Johnson",
      picture: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Bob Smith",
      picture: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      name: "Charlie Brown",
      picture: null // No picture
    },
    {
      id: 4,
      name: "Emily Davis",
      picture: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 5,
      name: "John Doe",
      picture: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 6,
      name: "Sarah Lee",
      picture: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 7,
      name: "Mark Fisher",
      picture: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      id: 8,
      name: "Jessica Taylor",
      picture: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 9,
      name: "James Black",
      picture: null // No picture
    },
    {
      id: 10,
      name: "Chris Wright",
      picture: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: 11,
      name: "Olivia White",
      picture: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      id: 12,
      name: "Lucas Green",
      picture: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
      id: 13,
      name: "Liam Scott",
      picture: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
      id: 14,
      name: "Mia Moore",
      picture: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
      id: 15,
      name: "Noah Adams",
      picture: "https://randomuser.me/api/portraits/men/8.jpg"
    },
    {
      id: 16,
      name: "Sophie Garcia",
      picture: "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
      id: 17,
      name: "Henry Martinez",
      picture: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
      id: 18,
      name: "Amelia Clark",
      picture: null // No picture
    }
  ],
  children: <p>Join our next meetup on Friday!</p>,//posts will be here
  srcImg: "https://media.licdn.com/dms/image/v2/D4D12AQF26-NZ279EaA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1688018102545?e=2147483647&v=beta&t=XMRwgTVSCknARngRO6R3_nFRrOX-BVxrpFLuwVX-SOA"
};