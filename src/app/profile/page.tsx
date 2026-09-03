"use client";

import NavBar from "../../components/layout/NavBar";
import ProfileView from "@/components/profile/ProfileView";
import { useUserId } from "@/hooks/useUserId";

export default function ProfilePage() {
  const userId = useUserId() ?? "1";

  return (
    <NavBar>
      <ProfileView userId={userId} />
    </NavBar>
  );
}