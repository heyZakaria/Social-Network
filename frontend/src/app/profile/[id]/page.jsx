'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProfileComponent from '@/components/profile/profile-component';
import { useUser } from '@/context/user_context';

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser, loading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const { id: ids } = useParams(); 

  useEffect(() => {
    async function loadProfileUser() {
      try {
        const res = await fetch(`/api/users/get/profile?id=${ids}`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace('/not-found');
          return;
        }

        const json = await res.json();
        const user = json.data?.Data;

        if (!user) {
          router.replace('/not-found');
          return;
        }

        setProfileUser(user);
        if (currentUser && user) {
          user.IsOwnProfile = (user.id === currentUser.id);
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
        router.replace('/not-found');
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfileUser();
  }, [ids, currentUser, router]);

  if (loading || profileLoading) return <div>Loading...</div>;

  return (
    <ProfileComponent
      ProfileData={profileUser}
      currentUser={currentUser}
    />
  );
}
