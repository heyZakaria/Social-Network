'use client';
import { useRouter } from 'next/navigation';
/////////// we are not using this function
export async function fetchWithAuth(url, options = {}, router) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Unauthorized - redirecting to login');
        router.push('/login');
        return null;
      }

      const error = await response.text();
      console.error('API Error:', response.status, error);
      return null;
    }

    return response;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
