import { useState } from "react"

export default function SuggestedGroups({Groups}){
    const dummyGroups = [
        { Id: 1, name: "Tech Enthusiasts", description: "A group for tech lovers.", cover: "https://via.placeholder.com/150", JoiningState: "join" },
        { Id: 2, name: "Book Club", description: "A place to discuss books.", cover: "https://via.placeholder.com/150", JoiningState: "pending" },
        { Id: 3, name: "Art Lovers", description: "For those who appreciate art.", cover: "https://via.placeholder.com/150", JoiningState: "member" },
      ];
      
const [JoiningState , SetJoinst] = useState()
function handleJoin(){
    SetJoinst(true)
}
return (
    <ul>
        {Groups.map(Group=>{
            <li key={Group.Id} id={Group.Id}>
<SuggGroupCard JoiningState={JoiningState}></SuggGroupCard>
            </li>
        })}
    </ul>
)
}

function SuggGroupCard({Group , JoiningState}){
//Only Show The Groups which the user is not member of 
    return(
           <div className="Groupcard">
            <img src={Group.cover} alt={Group.name}/>
            <p>{Group.name}</p>
            <p>{Group.description}</p>
           { JoiningState === 'Pending' || JoiningState === 'Join' ? <button >{JoiningState}</button> : null } 
           </div> 
    )
}



// Usage with the dummy data
const dummyGroups = [
    { Id: 1, name: "Tech Enthusiasts", description: "A group for tech lovers.", cover: "https://via.placeholder.com/150", JoiningState: "join" },
    { Id: 2, name: "Book Club", description: "A place to discuss books.", cover: "https://via.placeholder.com/150", JoiningState: "pending" },
    { Id: 3, name: "Art Lovers", description: "For those who appreciate art.", cover: "https://via.placeholder.com/150", JoiningState: "member" },
  ];
  