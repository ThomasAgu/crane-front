import { ExternalLink } from "lucide-react";
import type { AppHostDto } from "@/lib/dto/AppDto";

type AppHost = AppHostDto | string | Record<string, unknown>;

interface AppHostLinksProps {
  hosts?: AppHost[] | null;
  compact?: boolean;
}

function getHostValue(host: AppHost): { label: string; url: string } | null {
  if (typeof host === "string") {
    const url = host.trim();
    return url ? { label: url, url } : null;
  }

  const record = host as Record<string, unknown>;
  const urlValue = record.url ?? record.host ?? record.href;
  if (typeof urlValue !== "string" || !urlValue.trim()) return null;

  const service = typeof record.name === "string"
    ? record.name
    : typeof record.service === "string"
      ? record.service
      : undefined;
  const url = urlValue.trim();
  return { label: service ? `${service}: ${url}` : url, url };
}

function getHref(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  if (/^[\w.-]+:\d+(?:\/.*)?$/.test(url)) return `http://${url}`;
  if (/^[\w.-]+(?:\/.*)?$/.test(url)) return `http://${url}`;
  return null;
}

export default function AppHostLinks({ hosts, compact = false }: AppHostLinksProps) {
  const links = (hosts ?? [])
    .map(getHostValue)
    .filter((host): host is { label: string; url: string } => Boolean(host))
    .map((host) => ({ ...host, href: getHref(host.url) }))
    .filter((host) => host.href);

  if (!links.length) {
    return <p className="text-xs italic text-slate-400">No hay URLs de servicios disponibles.</p>;
  }

  return (
    <ul className={compact ? "space-y-1" : "space-y-2"}>
      {links.map((host, index) => (
        <li key={`${host.href}-${index}`}>
          <a
            href={host.href ?? "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            <ExternalLink size={compact ? 13 : 15} aria-hidden="true" />
            <span className="truncate">{host.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}