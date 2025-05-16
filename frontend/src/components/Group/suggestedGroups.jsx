import { useState } from "react"
import './suggestedGroups.css'

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
      CreatedAt={Group.CreationDate}
      ></GroupCardInfo>
    </div>
  );
}





export default function GroupsList() {
  const [Groups, setGroups] = useState([
  {
    Id: 1,
    name: "React Developers",
    description: "A community for React developers to collaborate and learn.",
    cover: "https://loremflickr.com/320/160/reactjs",
    JoiningState: "Join",
    Members: 1230,
    PostCount: 215,
    CreationDate: "2021-04-15",
  },
  {
    Id: 2,
    name: "Go Enthusiasts",
    description: "A space for Go developers to share ideas and solve problems.",
    cover: "https://loremflickr.com/320/160/golang",
    JoiningState: "Pending",
    Members: 120,
    PostCount: 58,
    CreationDate: "2022-09-10",
  },
  {
    Id: 3,
    name: "Frontend Developers",
    description: "Connecting front-end developers across the globe.",
    cover: "https://picsum.photos/320/160?random=1",
    JoiningState: "Join",
    Members: 11,
    PostCount: 12,
    CreationDate: "2023-01-05",
  },
  {
    Id: 4,
    name: "Python Devs",
    description: "The ultimate hub for Python developers and enthusiasts.",
    cover: "https://loremflickr.com/320/160/python,code",
    JoiningState: "Join",
    Members: 1,
    PostCount: 3,
    CreationDate: "2024-02-20",
  },
  {
    Id: 5,
    name: "Data Scientists",
    description: "A group for data scientists to collaborate on projects.",
    cover: "https://picsum.photos/320/160?random=2",
    JoiningState: "Pending",
    Members: 657,
    PostCount: 129,
    CreationDate: "2022-06-30",
  },
  {
    Id: 6,
    name: "UX/UI Designers",
    description: "A community of UX/UI designers improving user experiences.",
    cover: "https://placehold.co/320x160/eee/333?text=UX+Design",
    JoiningState: "Join",
    Members: 546,
    PostCount: 94,
    CreationDate: "2021-12-11",
  },
  {
    Id: 7,
    name: "Cybersecurity Experts",
    description: "Join to learn and share cybersecurity knowledge.",
    cover: "https://loremflickr.com/320/160/cybersecurity",
    JoiningState: "Pending",
    Members: 14850,
    PostCount: 842,
    CreationDate: "2019-08-22",
  },
]);

  const [FiltredGroups, setFiltredGroups] = useState([]);
  const [FilterState, setFilterState] = useState("Join");

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
      <Section Title="X"
        Content={MembersCount}
      ></Section>
      <Section Title="X"
        Content={PostCount}
      ></Section>
      <Section Title="X"
        Content={CreatedAt}
      ></Section>

    </div>
  )
}


function Section({ Title, Content }) {



  return <section className="Section">
    <h2>{Title}</h2>
    <p>{Content}</p>
  </section>




}