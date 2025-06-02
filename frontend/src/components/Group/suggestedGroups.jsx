import { useState , useEffect } from "react"
import './suggestedGroups.css'
import { MdOutlineGroups, MdEvent , MdOutlineInsertComment } from "react-icons/md";
import useFetch from '../../hooks/useFetch';


function SuggGroupCard({ Group, onSendJoinRequest }) {
const isJoinable = ["Pending", "Join"].includes(Group.JoiningState);
  return (
    <div className="groupCard">
      <img src={Group.covername || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLlfA6Mh7quJkQ8QarreKuct5BEuFs45u8gQ&s"} alt={Group.title} />
      <div className="groupCardContent">
        <p>{Group.title}</p>
        <p>{Group.description}</p>
{isJoinable && (
  <button
    className={Group.JoiningState === "Pending" ? "Pending" : ""}
    onClick={() => onSendJoinRequest()}
  >
    {Group.JoiningState}
  </button>
)}

      </div>
      <GroupCardInfo
        MembersCount={Group.Members}
        PostCount={Group.PostCount}
        CreatedAt={Group.EventsCount}
      ></GroupCardInfo>
    </div>
  );
}





export default function GroupsList() {
 const { data, loading, error } = useFetch("http://localhost:8080/api/groups/");

  const [Groups, setGroups] = useState([]);
  const [FiltredGroups, setFiltredGroups] = useState([]);
  const [FilterState, setFilterState] = useState("Join");
  const [err , setError] = useState(null)

  useEffect(() => {
    if (data) {
      console.log(data);
      
      const mapped = data.data.map(group => ({
        Id: group.id,
        title: group.title,
        description: group.description,
        covername: group.covername,
        JoiningState: group.memberState || "Join",
        Members: group.memberCount,
        PostCount: group.postCount ?? 0,
        EventsCount: group.eventsCount ?? 0
      }));
      setGroups(mapped);
      setFiltredGroups(mapped.filter(group => group.JoiningState === FilterState));
    }
  }, [data]);


  const HandleGroupSection = (Joinst) => {
    setFilterState(Joinst);
    if (Joinst === "All") {
      setFiltredGroups(Groups);
    } else {

      setFiltredGroups(Groups.filter((group) => group.JoiningState === Joinst));
    }
  };

  const SendorCancelJoinRequest = async(groupId , CurrentUserState) => {
      
  
        try {
        const respo = await fetch(`http://localhost:8080/api/groups/join?id=${groupId}&action=${CurrentUserState == "Join" ? "Joining" : "Canceling"}` , 
          {
            credentials: "include",
            method:"POST"
          }
        )
          if(!respo.ok){
            throw new Error("Error Sending Join Request")
          }
           const Data = await respo.json()
           console.log(Data);
            const updatedGroups = Groups.map((group) =>
      group.Id === groupId
        ? {
          ...group,
  JoiningState: CurrentUserState === "Join" ? "Pending" : "Join"
        }
        : group
    );

    setGroups(updatedGroups);
    setFiltredGroups(FilterState !== 'All' ? updatedGroups.filter((group) => group.JoiningState === FilterState) : updatedGroups)

          
        } catch (error) {
          setError(error)
        }

        
  };
    
  if (loading) return <p>Loading groups...</p>;
if (error || err) return <p>Error: {(error?.toString() || err?.message || "Unknown error")}</p>;
  
   


  return (
    <div className="groupListContainer">
      <div className="groupListHeader">
            <button value="Admin" onClick={(e) => HandleGroupSection(e.target.value)}>
         Your Groups
        </button>
        <button value="Pending" onClick={(e) => HandleGroupSection(e.target.value)}>
          Pending Groups
        </button>
        <button value="Join" onClick={(e) => HandleGroupSection(e.target.value)}>
          Suggested Groups
        </button>
        <button value="All" onClick={(e) => HandleGroupSection(e.target.value)}>
          Show all
        </button>
      </div>

      <ul className="groupList">
        {FiltredGroups.map((group) => (
          <SuggGroupCard
            key={group.Id}
            Group={group}
            onSendJoinRequest={() => SendorCancelJoinRequest(group.Id , group.JoiningState)}
          />
        ))}
      </ul>
    </div>
  );
}


function GroupCardInfo({ MembersCount, PostCount, CreatedAt }) {


  return (
    <div className="InfoCountainer">
      <Section Title={<MdOutlineGroups></MdOutlineGroups>}
        Content={MembersCount}
        Name="Members"

      ></Section>
      <Section Title={<MdOutlineInsertComment></MdOutlineInsertComment>}
        Name="Posts"
        Content={PostCount}
      ></Section>
      <Section
        Name="Events"
        Title={<MdEvent></MdEvent>}
        Content={CreatedAt}
      ></Section>

    </div>
  )
}


function Section({ Title, Content, Name }) {
  return (
    <div className="Section">
        <div>{Title}</div>
      <div className="TitleContent">
        <h2>{Name}</h2>
        <p>{Content}</p>
      </div>
    </div>
  );
}

