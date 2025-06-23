import "@/styles/globals.css";
import { UserProvider } from "@/context/user_context";
import { FriendsProvider } from "@/context/friends_context";
import { NotificationsProvider } from "@/context/notifications-context";

import LayoutWrapper from "@/components/layout/layout-wrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NotificationsProvider>
            <FriendsProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </FriendsProvider>
          </NotificationsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
