"use client";
import { useApps } from "@/hooks/useApps";
import NavBar from "../../components/layout/NavBar";
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { GroupService } from "@/lib/api/groupService";
import { GroupDto } from "@/lib/dto/GroupDto";

export default function HomePage() {
  const [groups, setGroups] = useState<GroupDto[]>([]);

  useEffect(() => {
  const loadGroups = async () => {
    try {
      const data = await GroupService.getGroupsForUser();
      setGroups(data);
    } catch (err) {
      console.error("Error cargando los grupos:", err);
    }
  };

  loadGroups();
}, []);


  return (
    <main >
      <NavBar>
        <h1>Groups</h1>
      </NavBar>
    </main>
  );
}
