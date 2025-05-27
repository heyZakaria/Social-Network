import '@/styles/globals.css';
import { UserProvider } from '@/app/(utils)/user_context';
import { FriendsProvider } from '@/app/(utils)/friends-context';

import LayoutWrapper from '@/components/layout-wrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FriendsProvider>
          <UserProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UserProvider>
        </FriendsProvider>
      </body>
    </html>
  );
}
