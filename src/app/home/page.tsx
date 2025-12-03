"use client";
import { useEffect, useState } from "react";
import { getApps } from "@/src/lib/api/appService";
import { AppDto } from "@/src/lib/dto/AppDto";
import NavBar from "../../components/layout/NavBar";
import Dashboard from "../../components/ui/Dashboard";
import styles from "./home.module.css";
import EmptyHomeDashboard from "@/src/components/ui/EmptyHomeDashboard";
import Loader from "@/src/components/ui/Loader";

export default function HomePage() {
  const [apps, setApps] = useState<AppDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getApps();
        setApps(data);
      } catch (err) {
        console.error("Error cargando las apps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = async () => {
    const data = await getApps();
    setApps(data);
  };

  return (
      <main className={styles.mainContent}>
        <NavBar>
        {apps.length === 0 && !loading ?
          <div className={styles.noAppsContainer}>
            <h1 className="text-3xl font-bold mt-6 text-darkest">Inicio</h1>
            <EmptyHomeDashboard />
          </div>
        :
        <>
        <h1 className="text-3xl font-bold mt-6 text-darkest">Aplicaciones</h1>
        {loading ? (
          <div className="mt-6">
            <Loader loading={loading} width={80} height={80} />
          </div>
        ) : (
          <Dashboard apps={apps} onUpdate={handleUpdate} />
        )}
        </>
      }
        </NavBar>
      </main>
  );
}
