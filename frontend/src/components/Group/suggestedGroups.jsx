import { useState , useEffect } from "react"
import './suggestedGroups.css'
import { MdOutlineGroups, MdEvent , MdOutlineInsertComment } from "react-icons/md";
import useFetch from '../../hooks/useFetch';


function SuggGroupCard({ Group, onSendJoinRequest }) {
  return (
    <div className="groupCard">
      <img src={Group.cover} alt={Group.name} />
      <div className="groupCardContent">
        <p>{Group.name}</p>
        <p>{Group.description}</p>
        <button
          className={Group.JoiningState === "Pending" ? "Pending" : ""}
          onClick={() => onSendJoinRequest()}
        >
          {Group.JoiningState}
        </button>

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

  useEffect(() => {
    if (data) {
      const mapped = data.map(group => ({
        Id: group.id,
        name: group.title,
        description: group.description,
        cover: group.covername,
        JoiningState: group.memberState || "Join",
        Members: group.memberCount,
        PostCount: group.postCount ?? 0,
        EventsCount: group.eventsCount ?? 0
      }));
      setGroups(mapped);
      setFiltredGroups(mapped.filter(group => group.JoiningState === FilterState));
    }
  }, [data, FilterState]);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>Error: {error}</p>;

  const HandleGroupSection = (Joinst) => {
    setFilterState(Joinst);
    if (Joinst === "All") {
      setFiltredGroups(Groups);
    } else {

      setFiltredGroups(Groups.filter((group) => group.JoiningState === Joinst));
    }
  };

  const SendorCancelJoinRequest = (groupId) => {
    const updatedGroups = Groups.map((group) =>
      group.Id === groupId
        ? {
          ...group,
          JoiningState: group.JoiningState === "Pending" ? "Join" : "Pending",
        }
        : group
    );

    setGroups(updatedGroups);
    setFiltredGroups(FilterState !== 'All' ? updatedGroups.filter((group) => group.JoiningState === FilterState) : updatedGroups)

  };

  return (
    <div className="groupListContainer">
      <div className="groupListHeader">
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
            onSendJoinRequest={() => SendorCancelJoinRequest(group.Id)}
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