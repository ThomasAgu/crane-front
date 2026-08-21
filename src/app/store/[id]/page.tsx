"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import NavBar from "../../../components/layout/NavBar";
import { RequirePermission } from "../../../components/layout/RequirePermission";
import { AppService } from "@/lib/api/appService";
import { RepositoryService } from "@/lib/api/repositoryService";
import type { AppDto } from "@/lib/dto/AppDto";
import type { RepositoryDto } from "@/lib/dto/RepositoryDto";
import ServiceCard from "@/components/ui/ServiceCard";
import NetworkList from "@/components/ui/NetworkList";
import AlertCard from "@/components/ui/AlertCard";
import EnvironmentVariables from "@/components/ui/EnvironmentVariables";
import styles from "../store.module.css";

const formatDate = (value?: string | Date | null) =>
  value
    ? new Date(value).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })
    : "No disponible";

const formatValue = (value: unknown) =>
  value && typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "No configurado");

export default function StoreItemDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [repository, setRepository] = useState<RepositoryDto | null>(null);
  const [app, setApp] = useState<AppDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadDetails = useCallback(async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      const repositoryData = await RepositoryService.getRepository(params.id);
      const appData = await AppService.get(repositoryData.app_id.toString());
      setRepository(repositoryData);
      setApp(appData);
    } catch (requestError) {
      console.error("Error al cargar el detalle del repositorio:", requestError);
      setError("No se pudo cargar el detalle del repositorio.");
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const moderate = async (action: "approve" | "reject") => {
    if (!repository) return;
    try {
      setActionLoading(true);
      const updatedRepository = action === "approve"
        ? await RepositoryService.approveRepository(repository.id.toString())
        : await RepositoryService.rejectRepository(repository.id.toString());
      setRepository(updatedRepository);
    } catch (requestError) {
      console.error(`Error al ${action === "approve" ? "aprobar" : "rechazar"} el repositorio:`, requestError);
      setError("No se pudo actualizar el estado del repositorio.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <NavBar><main className={styles.detailPage}>Cargando detalle...</main></NavBar>;
  if (error || !repository || !app) return <NavBar><main className={styles.detailPage}>{error || "Detalle no disponible."}</main></NavBar>;

  return (
    <NavBar>
      <main className={styles.detailPage}>
        <button className={styles.backButton} onClick={() => router.push("/store")}>
          <ArrowLeft size={17} /> Volver al repositorio
        </button>

        <header className={styles.detailHeader}>
          <div>
            <p className={styles.detailEyebrow}>{app.is_template ? "Plantilla" : "Aplicación"}</p>
            <h1>{app.name}</h1>
            <p>{repository.description || "Sin descripción"}</p>
          </div>
          <span className={`${styles.stateBadge} ${styles[`state${repository.state}`]}`}>
            {repository.state}
          </span>
        </header>

        {repository.state === "pending" && (
          <RequirePermission object="REPOSITORYMODERATOR" action="GET">
            <div className={styles.moderationPanel}>
              <strong>Esta propuesta está pendiente de revisión.</strong>
              <div className={styles.moderationActions}>
                <button disabled={actionLoading} className={styles.actionRejectBtn} onClick={() => moderate("reject")}><X size={16} /> Rechazar</button>
                <button disabled={actionLoading} className={styles.actionApproveBtn} onClick={() => moderate("approve")}><Check size={16} /> Aprobar</button>
              </div>
            </div>
          </RequirePermission>
        )}

        <section className={styles.detailGrid}>
          <article className={styles.detailSection}>
            <h2>Aplicación</h2>
            <dl className={styles.infoList}>
              <div><dt>ID</dt><dd>{app.id}</dd></div>
              <div><dt>Estado</dt><dd>{app.status}</dd></div>
              <div><dt>Usuario</dt><dd>{app.user_id}</dd></div>
              <div><dt>Plantilla</dt><dd>{app.is_template ? "Sí" : "No"}</dd></div>
              <div><dt>Subida</dt><dd>{app.is_uploaded ? "Sí" : "No"}</dd></div>
              <div><dt>Creada</dt><dd>{formatDate(app.created_at)}</dd></div>
              <div><dt>Actualizada</dt><dd>{formatDate(app.updated_at)}</dd></div>
            </dl>
          </article>

          <article className={styles.detailSection}>
            <h2>Escalado</h2>
            <dl className={styles.infoList}>
              <div><dt>Mínimo</dt><dd>{app.min_scale ?? "No configurado"}</dd></div>
              <div><dt>Actual</dt><dd>{app.current_scale ?? "No configurado"}</dd></div>
              <div><dt>Máximo</dt><dd>{app.max_scale ?? "No configurado"}</dd></div>
              <div><dt>Parada forzada</dt><dd>{app.force_stop ? "Sí" : "No"}</dd></div>
            </dl>
          </article>
        </section>

        <section className={styles.detailSection}>
          <h2>Servicios ({app.services?.length ?? 0})</h2>
          <div className={styles.serviceDetailList}>
            {app.services?.length ? app.services.map((service, index) => (
              <ServiceCard key={`${service.name}-${index}`} service={service} index={index} />
            )) : <p>No hay servicios configurados.</p>}
          </div>
        </section>

        <section className={styles.detailSection}>
          <h2>Redes</h2>
          <NetworkList networks={app.services?.flatMap((service) => service.networks ?? []) ?? []} services={app.services ?? []} />
        </section>

        <section className={styles.detailGrid}>
          <article className={styles.detailSection}><h2>Entorno</h2><EnvironmentVariables variables={app.environment} /></article>
          <article className={styles.detailSection}><h2>Hosts</h2><pre>{formatValue(app.hosts)}</pre></article>
        </section>

        {app.alerts?.length ? <section className={styles.detailSection}><h2>Alertas ({app.alerts.length})</h2><div className={styles.alertDetailList}>{app.alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div></section> : null}
      </main>
    </NavBar>
  );
}