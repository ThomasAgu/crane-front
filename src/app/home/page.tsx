"use client";
import { useApps } from "@/hooks/useApps";
import NavBar from "../../components/layout/NavBar";
import Dashboard from "../../components/ui/Dashboard";
import EmptyHomeDashboard from "@/components/ui/EmptyHomeDashboard";
import Loader from "@/components/ui/Loader";
import styles from "./home.module.css";

export default function HomePage() {
  const { apps, loading, refreshApps } = useApps();

  const render = () => {
    if (loading) {
      return (
        <div className="mt-6">
          <Loader loading={loading} width={80} height={80} />
        </div>
      );
    }

    if (apps.length === 0) {
      return (
        <div className={styles.noAppsContainer}>
          <h1 className="text-3xl font-bold mt-6 text-darkest">Inicio</h1>
          <EmptyHomeDashboard />
        </div>
      );
    }

    return (
      <div className={styles.appsContainer}>
        <h1 className="text-3xl font-bold mt-6 text-darkest">Aplicaciones</h1>
        <Dashboard apps={apps} onUpdate={refreshApps} />
      </div>
    );
  };

  return (
    <main className={styles.mainContent}>
      <NavBar>
        {render()}
      </NavBar>
    </main>
  );
}
