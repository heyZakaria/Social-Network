import React, { useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import './InviteFriends.css';


export default function InviteFriends({ FriendsList, onInvite }) {
  
  return (
    <div className="friendListContainer">
      <ul className="friendList">
        {FriendsList.map((friend) => (
          <li key={friend.id} className="friendItemCard">
            <p>{`${friend.firstName} ${friend.lastName}`}</p>
            <img src={friend.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" } alt={friend.name} />
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
