"use client";
import { useApps } from "@/hooks/useApps";
import NavBar from "../../components/layout/NavBar";
import Dashboard from "../../components/ui/Dashboard";
import EmptyHomeDashboard from "@/components/ui/EmptyHomeDashboard";
import Loader from "@/components/ui/Loader";
import styles from "./home.module.css";

export default function HomePage() {
  const { apps, loading, refreshApps, removeApp } = useApps();

  const render = () => {
    if (loading) {
      return (
          <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <Loader loading={loading} width={50} height={50} />
          </div>
        );
    }

    if (apps.length === 0) {
      return (
        <div className={styles.noAppsContainer}>
          <EmptyHomeDashboard />
        </div>
      );
    }

    return (
      <div className={styles.appsContainer}>
        <header className={styles.homeHeader}>
          <p className={styles.homeEyebrow}>CRANE · Aplicaciones</p>
          <h1 className={styles.homeTitle}>Aplicaciones</h1>
          <p className={styles.homeDescription}>
            Administra tus aplicaciones y accede rápidamente a sus recursos.
          </p>
        </header>
        <Dashboard apps={apps} onUpdate={refreshApps} onDelete={removeApp} />
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
