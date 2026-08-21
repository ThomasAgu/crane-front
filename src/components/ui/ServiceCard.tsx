import type { ServiceDto } from "@/lib/dto/ServiceDto";
import NetworkList from "./NetworkList";
import EnvironmentVariables from "./EnvironmentVariables";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: ServiceDto;
  index?: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const volumes = service.volumes ?? [];
  const networks = service.networks ?? [];
  const environment = service.environment ?? {};

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <span className={styles.number}>{String((index ?? 0) + 1).padStart(2, "0")}</span>
          <h3>{service.name}</h3>
        </div>
        <code>{service.image || "Sin imagen"}</code>
      </header>

      <div className={styles.body}>
        {service.command && <InfoBlock label="Comando" value={`$ ${service.command}`} code />}
        {service.restart_policy && <InfoBlock label="Política de reinicio" value={service.restart_policy} />}
        {service.ports?.length ? <InfoBlock label="Puertos" value={service.ports.join(", ")} /> : null}

        <div className={styles.subsection}>
          <h4>Volúmenes ({volumes.length})</h4>
          {volumes.length ? <div className={styles.chipList}>{volumes.map((volume, volumeIndex) => <span className={styles.chip} key={`${String(volume)}-${volumeIndex}`}>{typeof volume === "string" ? volume : `${volume.path} (${volume.size ?? "-"} GB)`}</span>)}</div> : <p className={styles.empty}>Sin volúmenes configurados</p>}
        </div>

        <div className={styles.subsection}>
          <h4>Redes ({networks.length})</h4>
          {networks.length ? <NetworkList networks={networks} compact /> : <p className={styles.empty}>Sin redes configuradas</p>}
        </div>

        <div className={styles.subsection}>
          <h4>Variables de entorno ({Object.keys(environment).length})</h4>
          <EnvironmentVariables variables={environment} />
        </div>
      </div>
    </article>
  );
}

function InfoBlock({ label, value, code = false }: { label: string; value: string; code?: boolean }) {
  return <div className={styles.infoBlock}><h4>{label}</h4>{code ? <pre>{value}</pre> : <span>{value}</span>}</div>;
}
