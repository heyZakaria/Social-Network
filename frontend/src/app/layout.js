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


import { getCurrentUser } from "./actions/auth"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import "@/styles/globals.css"

export default async function RootLayout({ children }) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <head>
        <title>Social Network</title>
        <meta name="description" content="Connect with friends and share your moments" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Navbar user={user} />
        {/* {user ? ( */}
          <div className="container">
            <div className="main-content">
              <div className="left-sidebar">
                <Sidebar position="left" user={user} />
              </div>
              <div className="content-area">{children}</div>
              <div className="right-sidebar">
                <Sidebar position="right" user={user} />
              </div>
            </div>
          </div>
        {/* ) : (
          <div className="container">{children}</div>
        )} */}
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
