import { useState  , useEffect} from "react";
import styles from './CreateGroup.module.css'; // Import CSS Module
import InviteFriends from "@/components/Group/InviteFriends";
import GroupsList from "@/components/Group/suggestedGroups";
import { IoChevronBackCircleSharp , IoChevronForwardCircleSharp } from "react-icons/io5";



function isMember(DummyTest) {
  // Need To Check if the user is a Member
  return DummyTest; 
}

function GroupNav({OnMembers, HandleShowInvite}) {
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
        <a href="#" onClick={()=>{ HandleShowInvite()}}>Invite Friends</a>
                <a href="#" onClick={()=>{ OnMembers()}}>Members</a>

        <a href="#" onClick={()=>{console.log("DisplayEVents")}}>Events</a>
        
      </div>
    );
  }

  return Nav;
}

function Members({ members }) {
  const [Current , setCurrent] = useState(0)
  const [PaginatedMembers , setPaginatedMembers] = useState(members.slice(Current , Current+3))
    useEffect(() => {
    setPaginatedMembers(members.slice(Current, Current + 3));
  }, [Current, members]);

  const MembersList = (
<ul className={styles.membersList}>
      {PaginatedMembers.map((member) => (

        <li key={member.id} className={styles.memberItem}>
          <p>{member.name}</p>
            <img
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
          <img
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



export default function GroupCard({  imgSrc , groupName, description, children, members }) {
  const [ShowInvite , setShowInvite] = useState(false);
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

  
  const HandleShowInvite = ()=>{
    setShowInvite(prev=> !prev)
    if (ShowMembers){
              setShowMembers(!ShowMembers)

    }
  } 

      const [ShowMembers , setShowMembers ] = useState(false)

      const HandleMembersList = ()=>{
        setShowMembers(!ShowMembers)
if (ShowInvite){
              setShowInvite(prev=> !prev)
}

        console.log("toggled Members");
        
      }
  
  return (
    <div className={styles.GroupCardContainer}>
      <img src={imgSrc}
      alt= {groupName}></img>
      <h1 className={styles.groupTitle}>{groupName}</h1>
      <Description Text={description} />
      <GroupNav HandleShowInvite={HandleShowInvite}  OnMembers= {HandleMembersList}FriendsList={FriendsList1}></GroupNav>
      {ShowMembers && <Members members={members} />}
      {children}
      {ShowInvite && <InviteFriends FriendsList={invitedFriends} onInvite = {handleInvite}></InviteFriends>}

      <GroupsList></GroupsList>

    </div>
  );
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
