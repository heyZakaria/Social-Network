'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile/profile-component';
import { useUser } from '@/app/(utils)/user_context';
import { fetchWithAuth } from '@/app/(utils)/api';
import { useParams } from 'next/navigation';

export default function ProfilePage({ params }) {
  

  const router = useRouter();
  const { user: currentUser, loading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  console.log("current", currentUser);
  

  
  // params.id = currentUser.id
  const paramsx = useParams();
  const ids = paramsx.id
  
  
  // params is a Record<string, string> | null
  // const id = params?.id;
  useEffect(() => {
    async function loadProfileUser() {
      try {
        const res = await fetch(`/api/users/get/profile?id=${ids}`);
        if (!res.ok) {
          setNotFoundFlag(true);
          return;
        }
        const json = await res.json();
        
        setProfileUser(json.data.Data);
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFoundFlag(true);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfileUser();
  }, [ids]);
  
  
  
  
  if (loading || profileLoading) return <div>Loading...</div>;

  const canView = true // currentUser.id === profileUser.id || profileUser.ProfileStatus === 'public';
  // profileUser.isPublic = true
  return (
    <ProfileComponent
      ProfileData={
        profileUser
      }
      // profileUser={{
      //   id: profileUser.id,
      //   firstName: profileUser.FirstName,
      //   lastName: profileUser.LastName,
      //   email: profileUser.Email,
      //   nickname: profileUser.NickName,
      //   bio: profileUser.Bio,
      //   avatar: profileUser.Avatar,
      //   profileStatus: profileUser.ProfileStatus,
      //   birthday: profileUser.Birthday,
      //   createdAt: profileUser.CreatedAt,
      //   Posts: profileUser.Posts || [],
      //   Followers: profileUser.Followers || [],
      //   Following: profileUser.Following || [],
      //   FollowerCount: profileUser.FollowerCount || 0,
      //   FollowingCount: profileUser.FollowingCount || 0,
      // }}
      currentUser={
        currentUser
      }
      canView={canView}
    />
  );
}
