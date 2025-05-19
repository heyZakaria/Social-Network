'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile/profile-component';
import { useUser } from '@/app/(utils)/user_context';

export default function ProfilePage({ params }) {
  const router = useRouter();
  const { user: currentUser, loading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    async function loadProfileUser() {
      try {
        const res = await fetch(`/api/user/${params.id}`);
        if (!res.ok) {
          setNotFoundFlag(true);
          return;
        }
        const json = await res.json();
        setProfileUser(json.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFoundFlag(true);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfileUser();
  }, [params.id]);

  if (loading || profileLoading) return <div>Loading...</div>;

  if (!currentUser || notFoundFlag) {
    useEffect(() => {
      router.replace('/404');
    }, []);
    return null;
  }

  const canView = currentUser.UserID === profileUser.UserID || profileUser.ProfileStatus === 'public';

  return (
    <ProfileComponent
      currentUser={{
        id: currentUser.UserID,
        firstName: currentUser.FirstName,
        lastName: currentUser.LastName,
        email: currentUser.Email,
        nickname: currentUser.NickName,
        avatar: currentUser.Avatar,
        profileStatus: currentUser.ProfileStatus,
      }}
      profileUser={{
        id: profileUser.UserID,
        firstName: profileUser.FirstName,
        lastName: profileUser.LastName,
        email: profileUser.Email,
        nickname: profileUser.NickName,
        bio: profileUser.Bio,
        avatar: profileUser.Avatar,
        profileStatus: profileUser.ProfileStatus,
        birthday: profileUser.Birthday,
        createdAt: profileUser.CreatedAt,
        Posts: profileUser.Posts || [],
        Followers: profileUser.Followers || [],
        Following: profileUser.Following || [],
        FollowerCount: profileUser.FollowerCount || 0,
        FollowingCount: profileUser.FollowingCount || 0,
      }}
      canView={canView}
    />
  );
}
