"use client"

import GroupsList from "@/components/Group/suggestedGroups";
import {RequestsToJoinGroup} from "@/components/Group/PendingInvites"

export default function GroupsSugges(){

 return (
 <>
 <GroupsList></GroupsList>
 <RequestsToJoinGroup></RequestsToJoinGroup>
 </>
 )
}


   const groupCardData = {
        groupName: "React Enthusiasts",
        description: "A community of developers passionate about building with React.",
        members:  [
  {
    id: 1,
    name: "Alice Johnson",
    picture: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Bob Smith",
    picture: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Charlie Brown",
    picture: null // No picture
  },
  {
    id: 4,
    name: "Emily Davis",
    picture: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 5,
    name: "John Doe",
    picture: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 6,
    name: "Sarah Lee",
    picture: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 7,
    name: "Mark Fisher",
    picture: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 8,
    name: "Jessica Taylor",
    picture: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 9,
    name: "James Black",
    picture: null // No picture
  },
  {
    id: 10,
    name: "Chris Wright",
    picture: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    id: 11,
    name: "Olivia White",
    picture: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    id: 12,
    name: "Lucas Green",
    picture: "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    id: 13,
    name: "Liam Scott",
    picture: "https://randomuser.me/api/portraits/men/7.jpg"
  },
  {
    id: 14,
    name: "Mia Moore",
    picture: "https://randomuser.me/api/portraits/women/6.jpg"
  },
  {
    id: 15,
    name: "Noah Adams",
    picture: "https://randomuser.me/api/portraits/men/8.jpg"
  },
  {
    id: 16,
    name: "Sophie Garcia",
    picture: "https://randomuser.me/api/portraits/women/7.jpg"
  },
  {
    id: 17,
    name: "Henry Martinez",
    picture: "https://randomuser.me/api/portraits/men/9.jpg"
  },
  {
    id: 18,
    name: "Amelia Clark",
    picture: null // No picture
  }
],
        children: <p>Join our next meetup on Friday!</p> ,//posts will be here
        srcImg: "https://media.licdn.com/dms/image/v2/D4D12AQF26-NZ279EaA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1688018102545?e=2147483647&v=beta&t=XMRwgTVSCknARngRO6R3_nFRrOX-BVxrpFLuwVX-SOA"
      };

      