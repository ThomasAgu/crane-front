import { useEffect, useState } from 'react';
import { UserService } from '@/lib/api/userService';
import type { UserDataDtoDetails } from '@/lib/dto/UserDto';

export function useProfile(userId: string) {
  const [user, setUser] = useState<UserDataDtoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!userId) {
        setUser(null);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const profile = await UserService.get(userId);
        if (!cancelled) setUser(profile);
      } catch (requestError) {
        console.error('Error al cargar el perfil:', requestError);
        if (!cancelled) {
          setUser(null);
          setError('No se pudo cargar el perfil del usuario.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
}