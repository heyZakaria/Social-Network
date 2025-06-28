import React, { useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import './InviteFriends.css';


export default function InviteFriends({ FriendsList, onInvite }) {
  if (!FriendsList || FriendsList.length ===0)return <p>No More Friends To Invite</p>
  return (
    <div className="friendListContainer">
      <ul className="friendList">
        {FriendsList.map((friend) => (
          <li key={friend.id} className="friendItemCard">
            <p>{`${friend.firstName} ${friend.lastName}`}</p>
            <img src={friend.avatar || "/uploads/invite_profie.jpg" } alt={friend.name} />
            <InviteButton
              UserId={friend.id}
              HandleClick={() => onInvite(friend.id)}
              Invited={friend.invited}
            />
          </li>
        ))}
      </ul>
     </div>
  );
}

function InviteButton({ UserId, HandleClick, Invited }) {
  return (
    <button
      className={`inviteButton ${Invited ? "invited" : ""}`} 
      id={UserId}
      onClick={HandleClick}
    >
      {Invited ? <IoCheckmarkDoneCircleSharp /> : "Invite"}
    </button>
  );
}
