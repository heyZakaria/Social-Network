import { UserProvider } from "@/context/user_context";
import { FriendsProvider } from "@/context/friends_context";
// import NotificationsWrapper from "@/components/layout/notifications-wrapper"; 
import NotificationsWrapper from "@/components/layout/notifications-wrapper";
import '@/styles/globals.css'
import LayoutWrapper from "@/components/layout/layout-wrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationsWrapper> 
          <UserProvider>
            <FriendsProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </FriendsProvider>
          </UserProvider>
        </NotificationsWrapper>
      </body>
    </html>
  );
}
