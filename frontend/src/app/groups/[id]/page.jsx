"use client"
import { useState, useEffect } from "react";
import styles from './GroupCard.module.css';
import InviteFriends from "@/components/Group/InviteFriends";
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp } from "react-icons/io5";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ShowEventForm from "@/components/events/newEvent";
import CreatePost from "@/components/posts/create-post";
import Link from "next/link";
import UpcomingEvents from "@/components/events/upcoming-events";


function isMember(DummyTest) {
  // Need To Check if the user is a Member
  return DummyTest;
}

function GroupNav({ OnMembers, HandleShowInvite }) {
  const [JoinRequest, setJoinRequest] = useState(false);

  const p = useParams()
  const groupId = p.id
  console.log("wa3333333333333 groupId:", groupId);
  

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
  const router = useRouter()
  const HandleEvents = (e) => {
    e.preventDefault();
    router.push(`${groupId}?events=all`)
    
  }

  if (isMember(true)) {
    Nav = (
      <div className={styles.GroupNav}>
        <a href="#" onClick={() => { HandleShowInvite() }}>Invite Friends</a>
        <a href="#" onClick={() => { OnMembers() }}>Members</a>

        <button onClick={HandleEvents}>Eventss</button>

      </div>
    );
  }

  return Nav;
}

function Members({ members, groupId }) {
  const [Current, setCurrent] = useState(0)
  console.log("paginated", members);
  let PaginatedMembers = members
if (members.length > 3) {
  PaginatedMembers =   members.slice(Current, Current + 3)
}

   

  const MembersList = (

    <ul className={styles.membersList} id={groupId}>
      {PaginatedMembers.map((member) => (

        <li key={member.User_id} className={styles.memberItem}>
                  <Link href={`/profile/${member.User_id}`}>
          <p>{`${member.FirstName} ${member.LastName}`}</p>
          <img
            className={styles.memberImage}
            src={member.Avatar || "https://cdn1.iconfinder.com/data/icons/fillio-users-and-hand-gestures/48/person_-_man_2-512.png"}
            alt={`${member.FirstName} ${member.LastName}`}
          />
          <p>{member.Role}</p>
      </Link>
        </li>
      ))}
    </ul>


  );

  if (!members || members.length === 0) {
    return <p>No members found.</p>;
  }
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
      {MembersList}
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
  const [refrech, setRefrech] = useState(0);
  const [group, setGroup] = useState([])
  const [err, SetErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [ShowInvite, setShowInvite] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState(
    FriendsList1.map(friend => ({ ...friend, invited: false }))
  );


  const p = useParams()
  const groupId = p.id
  console.log("groupId:", groupId);

  const handleInvite = (id) => {
    setInvitedFriends(prevInvite =>
      prevInvite.map(friend =>
        friend.Id === id ? { ...friend, invited: !friend.invited } : friend
      )
    );
  };

  const HandleRefrech = ()=>{
    setRefrech(prev => prev +1)
  }

  const HandleShowInvite = () => {
    setShowInvite(prev => !prev)
    if (ShowMembers) {
      setShowMembers(!ShowMembers)

    }
  }

  const [ShowMembers, setShowMembers] = useState(false)

  const HandleMembersList = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/api/groups/group/members?id=${groupId}`,
        { credentials: "include" })
      if (!resp.ok) { throw new Error("Something Happened , Try Again") }
      const Data = await resp.json()
      console.log("data", Data)
      setMembers(Data.data)
      setShowMembers(true)
      if (ShowInvite) { setShowInvite(false) }
      console.log("toggled Members");
    } catch (error) {
      SetErr(err.message)
    }



  }


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
        console.log(Data.data, "dttdtd");
        setGroup(Data.data)

        if (!res.ok) { throw new Error(Data.message) }
        console.log(group);


      }).
      then(Data => {
        console.log(Data)
      }).catch(error => {
        SetErr(error.message)
      })
    setLoading(false)
  }, [groupId])

  if (loading) return <p>Data is Loading</p>
  if (err !== null) return <p>{err}</p>
  return (

    <div id={group.id} className={styles.GroupCardContainer}>
      <img src={`/uploads/groups_cover/${group.covername}`}
        alt={group.title}
        className={styles.Groupcover}></img>
      <h1 className={styles.groupTitle}>{group.title}</h1>
      <Description Text={group.description} />
      <GroupNav HandleShowInvite={HandleShowInvite} OnMembers={HandleMembersList} FriendsList={FriendsList1}></GroupNav>
      {ShowMembers && <Members members={members} />}
      {children}
      
      {ShowInvite && <InviteFriends FriendsList={invitedFriends} onInvite={handleInvite}></InviteFriends>} 
      {<ShowEventForm ></ShowEventForm>}
      {<UpcomingEvents/>}
      
      <CreatePost Refrech={HandleRefrech} GroupId={groupId}/>
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