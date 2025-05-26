import '@/styles/globals.css';
import { UserProvider } from '@/app/(utils)/user_context';
import LayoutWrapper from '@/components/layout-wrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
