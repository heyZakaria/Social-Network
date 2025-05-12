import { useState } from "react";
import styles from './CreateGroup.module.css'; // Import CSS Module

function isMember(DummyTest) {
  // Need To Check if the user is a Member
  return DummyTest; 
}

function GroupNav() {
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
        <a href="#" onClick={()=>{console.log("DisplayListOfFriendsToInvite")}}>Invite Friends</a>
        <a href="#" onClick={()=>{console.log("DisplayEVents")}}>Events</a>
      </div>
    );
  }

  return Nav;
}

function Members({ members }) {
  const MembersList = (
    <ul className={styles.membersList}>
      {members.map((member) => (
        <li key={member.id} className={styles.memberItem}>
          <p>{member.name}</p>
          {member.picture && (
            <img
              className={styles.memberImage}
              src={member.picture}
              alt={member.name}
            />
          )}
        </li>
      ))}
    </ul>
  );

  return MembersList;
}

function Description({ Text }) {
  return <p className={styles.Description}>{Text}</p>;
}

export default function GroupCard({ groupName, description, children, members }) {
  return (
    <div className={styles.GroupCardContainer}>
      <GroupNav></GroupNav>
      <h1 className={styles.groupTitle}>{groupName}</h1>
      <Description Text={description} />
      <Members members={members} />
      {children}
    </div>
  );
}
