import type { NetworkDto, ServiceDto } from "@/lib/dto/ServiceDto";
import styles from "./NetworkList.module.css";

interface NetworkListProps {
  networks: Array<NetworkDto | string>;
  services?: ServiceDto[];
  compact?: boolean;
}

interface NetworkGroup extends NetworkDto {
  services: string[];
}

export default function NetworkList({ networks, services = [], compact = false }: NetworkListProps) {
  const groups = groupNetworks(networks, services);

  if (!groups.length) return <p className={styles.empty}>Sin redes configuradas</p>;

  return (
    <div className={`${styles.list} ${compact ? styles.compact : ""}`}>
      {groups.map((network) => (
        <article className={styles.network} key={network.name}>
          <header><span className={styles.icon}>◎</span><strong>{network.name}</strong><span className={styles.driver}>{network.driver || "default"}</span></header>
          {!compact && <dl>
            <div><dt>Dirección</dt><dd>{network.address ?? "No configurada"}</dd></div>
            <div><dt>Máscara</dt><dd>{network.mask ?? "No configurada"}</dd></div>
            <div><dt>Gateway</dt><dd>{network.gateway ?? "No configurado"}</dd></div>
          </dl>}
          {network.services.length > 0 && <footer>Servicios: {network.services.join(", ")}</footer>}
        </article>
      ))}
    </div>
  );
}

function groupNetworks(networks: Array<NetworkDto | string>, services: ServiceDto[]): NetworkGroup[] {
  const groups = new Map<string, NetworkGroup>();
  networks.forEach((network) => addNetwork(groups, network));

  services.forEach((service) => {
    (service.networks ?? []).forEach((network) => {
      const normalized = normalizeNetwork(network);
      const group = groups.get(normalized.name) ?? { ...normalized, services: [] };
      if (!group.services.includes(service.name)) group.services.push(service.name);
      groups.set(group.name, group);
    });
  });

  return Array.from(groups.values());
}

function addNetwork(groups: Map<string, NetworkGroup>, network: NetworkDto | string) {
  const normalized = normalizeNetwork(network);
  const current = groups.get(normalized.name);
  groups.set(normalized.name, { ...normalized, services: current?.services ?? [] });
}

function normalizeNetwork(network: NetworkDto | string): NetworkDto {
  return typeof network === "string" ? { name: network } : network;
}
