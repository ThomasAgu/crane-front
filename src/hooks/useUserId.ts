import { useEffect, useState } from 'react';

/**
 * Hook to extract and retrieve the user ID from the JWT token stored in localStorage
 * @returns The user_id from the JWT token, or null if not found/invalid
 */
export const useUserId = (): string => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUserId('');
        return;
      }
      // Decode JWT: split by '.', take the payload (middle part), decode from Base64
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.user_id || '');
    } catch (err) {
      console.error('Error extracting user_id from token:', err);
      setUserId('');
    }
  }, []);

  return userId;
};
