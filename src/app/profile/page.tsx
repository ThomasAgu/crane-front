"use client";
import { useApps } from "@/hooks/useApps";
import NavBar from "../../components/layout/NavBar";
import Loader from "@/components/ui/Loader";

export default function HomePage() {
  
  return (
    <main >
      <NavBar>
        <h1>Profile</h1>
      </NavBar>
    </main>
  );
}
