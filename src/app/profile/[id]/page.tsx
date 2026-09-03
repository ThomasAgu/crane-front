'use client';

import { useParams } from 'next/navigation';
import NavBar from '@/components/layout/NavBar';
import ProfileView from '@/components/profile/ProfileView';

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id ?? '1';

  return (
    <NavBar>
      <ProfileView userId={userId} />
    </NavBar>
  );
}
