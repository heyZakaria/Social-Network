'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile/profile-component';
import { useUser } from '@/context/user_context';
import { useParams } from 'next/navigation';

export default function ProfilePage({ params }) {
  const router = useRouter();
  const { user: currentUser, loading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);


  const paramsx = useParams();
  const ids = paramsx.id

  useEffect(() => {

    async function loadProfileUser() {
      try {
        const res = await fetch(`/api/users/get/profile?id=${ids}`, {
          credentials: "include",
        }
        );
        
        if (!res.ok) {
          setNotFoundFlag(true);
          return;
        }

        const json = await res.json();
        const user = json.data.Data;
        console.log('ProfilePage: Response from /api/users/get/profile:', user);
        
        setProfileUser(user);
        if (currentUser && user) {
          user.IsOwnProfile = (user.id === currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFoundFlag(true);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfileUser();
  }, [ids, currentUser]);

  if (loading || profileLoading) return <div>Loading...</div>;

  return (
    <ProfileComponent
      ProfileData={
        profileUser
      }
      currentUser={
        currentUser
      }
    />
  );
}
