"use client";
import { useParams } from "next/navigation";
import NavBar from "../../../components/layout/NavBar";
import GroupDetail from "@/components/groups/GroupDetail";
import styles from "@/components/groups/groups.module.css";


export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  return (
    <main className={styles.mainContent}>
      <NavBar>
        <GroupDetail groupId={groupId} />
      </NavBar>
    </main>
  );
}
