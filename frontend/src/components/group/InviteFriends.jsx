import React, { useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import Image from "next/image";
import './InviteFriends.css';


export default function InviteFriends({ FriendsList, onInvite }) {
  return (
    <div className="friendListContainer">
      <ul className="friendList">
        {FriendsList.map((friend) => (
          <li key={friend.Id} className="friendItemCard">
            <p>{friend.name}</p>
            <Image width={200} height={100} src={friend.Pic} alt={friend.name} />
            <InviteButton
              UserId={friend.Id}
              HandleClick={() => onInvite(friend.Id)}
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
