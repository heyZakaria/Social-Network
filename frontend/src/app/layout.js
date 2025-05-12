// import { Geist, Geist_Mono } from "next/font/google";
// import "./styles/globals.css";
// import NavBar from "@/components/navbar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Social",
//   description: "Social Network",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>

//         <div className="content">

//           <NavBar />
//           <main>{children}</main>

//         </div>
//       </body>
//     </html>
//   );
// }

import { getCurrentUser } from "./actions/auth";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Nav from "@/components/nav";
import "@/styles/globals.css";

export default async function RootLayout({ children }) {
  // const user = await getCurrentUser()
  const user = {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  };
  return (
    <html lang="en">
      <head>
        <title>Social Network</title>
        <meta
          name="description"
          content="Connect with friends and share your moments"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Nav />
        <Navbar user={user.firstName} />
        {/* {user ? ( */}
        <div className="container">
          <div className="main-content">
            <div className="left-sidebar">
              <Sidebar position="left" user={user.firstName} />
            </div>
            <div className="content-area">{children}</div>
            <div className="right-sidebar">
              <Sidebar position="right" user={user.firstName} />
            </div>
          </div>
        </div>
        {/* ) : (
          <div className="container">{children}</div>
        )} */}
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
