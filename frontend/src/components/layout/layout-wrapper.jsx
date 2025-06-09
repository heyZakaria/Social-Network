'use client';
import { useUser } from '@/context/user_context';
import Navbar from './navbar';
import Nav from './nav';
import Sidebar from './sidebar';

export default function LayoutWrapper({ children }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return user ? (
    <>
      <Navbar user={user} />
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
    </>
  ) : (
    <>
    <Nav/>
    <div className="container">{children}PPPPPp</div>
    </>
  );
}
