import react, { useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";


export default function inviteFriends({ FriendsList }) {

    return (
        <>
            <ul>
                {FriendsList.map(Friend => {
                    <li>
                        
                    </li>
                })}
            </ul>
        </>
    )
}

function InviteButton({User_Id}){
    const [Invited, SetInvite] = useState(false)
    return <button onClick={()=>{console.log("Invited")
        SetInvite(!Invited)
    }}>
{Invited ? <IoCheckmarkDoneCircleSharp></IoCheckmarkDoneCircleSharp> : "Invite"}
    </button>
}