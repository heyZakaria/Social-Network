'use client';

import { useRouter } from 'next/navigation';


export async function fetchUserProfile(userId, router) {
  try {
    const response = await fetch(`api/users/${userId}/profile`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
      if (response.status === 401) {
        router?.push('/login');
        return null;
      }
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.Data.Data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}