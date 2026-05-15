import { useEffect, useState } from 'react';

/**
 * Hook to extract and retrieve the user ID from the JWT token stored in localStorage
 * @returns The user_id from the JWT token, or null if not found/invalid
 */
export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUserId(null);
        return;
      }

      // Decode JWT: split by '.', take the payload (middle part), decode from Base64
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.user_id || null);
    } catch (err) {
      console.error('Error extracting user_id from token:', err);
      setUserId(null);
    }
  }, []);

  return userId;
};
