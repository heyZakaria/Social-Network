// import { useState } from "react";

// ///   const [isOpen, setIsOpen] = useState(false);
// export default function useFloatingChat(value) {
//     const [isOpen, setIsOpen] = useState(value);
//     const [activeChat, setActiveChat] = useState(null);
//     const [refresh, setRefresh] = useState(0);
//     const [recentChats, setRecentChats] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [newMessage, setNewMessage] = useState("");

//     useEffect(() => {
//         // In a real app, this would be an API call
//         // For now, we'll use mock data
//         const fetchRecentChats = async () => {
//         try {
//             const response = await FetchData(`/api/websocket/Get_Chat_History?chat_list=fetch`)
//             console.log("Response List Of users Chat History ", response.data.ChatList);
//             setRecentChats(response.data.ChatList);
//             setUnreadCount(
//             // response.data.ChatList.reduce((acc, chat) => acc + chat.unreadCount, 0)
//             );
//         } catch (error) {
//             console.error("Error fetching recent chats:", error);
//         }
//         };

//         fetchRecentChats();
//     }, [refresh]);

//     return { isOPEN, setIsOpen, activeChat, setActiveChat };
// }