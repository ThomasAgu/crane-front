import type { AlertCreateDto } from "@/lib/dto/AlertDto";
import type { CreateAppDto } from "@/lib/dto/AppDto";
import type { NetworkDto, ServiceDto, VolumeDto } from "@/lib/dto/ServiceDto";

export interface ConfigurationValidationIssue {
  message: string;
  title: string;
  field?: string;
  serviceIndex?: number;
  environmentIndex?: number;
}

export type AppConfigurationValidation =
  | { valid: true; warnings: string[] }
  | { valid: false; issue: ConfigurationValidationIssue };

const environmentKeyPattern = /^[A-Z_][A-Z0-9_]*$/;
const volumePathPattern = /^\/:(\/[A-Za-z0-9._-]+)+$/;

const validateEnvironment = (
  environment: Record<string, string> | null | undefined,
  fieldPrefix: "app-environment" | "service-environment",
  serviceIndex?: number
): ConfigurationValidationIssue | null => {
  const entries = Object.entries(environment ?? {});
  for (let environmentIndex = 0; environmentIndex < entries.length; environmentIndex++) {
    const [key, value] = entries[environmentIndex];
    if (!key.trim()) {
      return {
        message: "Completa tanto la clave como el valor de cada variable de entorno.",
        title: "Variables de entorno incompletas",
        field: `${fieldPrefix}-${environmentIndex}-key`,
        serviceIndex,
        environmentIndex,
      };
    }

    if (!environmentKeyPattern.test(key.trim())) {
      return {
        message: "Las claves deben contener únicamente letras mayúsculas, números y guiones bajos (ej.: DB_HOST).",
        title: "Formato de variable inválido",
        field: `${fieldPrefix}-${environmentIndex}-key`,
        serviceIndex,
        environmentIndex,
      };
    }

    if (!value?.trim()) {
      return {
        message: "Completa tanto la clave como el valor de cada variable de entorno.",
        title: "Variables de entorno incompletas",
        field: `${fieldPrefix}-${environmentIndex}-value`,
        serviceIndex,
        environmentIndex,
      };
    }
  }

  return null;
};

const validateVolume = (
  volume: VolumeDto | string,
  serviceIndex: number
): ConfigurationValidationIssue | null => {
  const path = typeof volume === "string" ? volume : volume.path;
  if (typeof path === "string" && volumePathPattern.test(path)) {
    return null;
  }

  return {
    message: `El path '${path}' no es válido. Debe tener forma '/:/folder/subfolder'.`,
    title: "Volumen inválido",
    field: "service-volume",
    serviceIndex,
  };
};

const getNetworkName = (network: NetworkDto | string) =>
  typeof network === "string" ? network : network.name;

const validateAlerts = (
  alerts: AlertCreateDto[]
): ConfigurationValidationIssue | null => {
  const hasIncompleteAlert = alerts.some(
    (alert) =>
      !alert.alert?.trim() ||
      !alert.expr?.trim() ||
      !alert.for_time?.toString().trim() ||
      !alert.summary?.trim()
  );

  return hasIncompleteAlert
    ? {
        message: "Hay alertas incompletas. Revisa nombre, expresión, duración y resumen de cada alerta.",
        title: "Validación de Alertas",
      }
    : null;
};

const getWarnings = (services: ServiceDto[]) =>
  services.flatMap((service) => {
    const warnings: string[] = [];
    if (!service.startupScripts?.length && !service.startup_scripts?.length) {
      warnings.push(`${service.name}: no tiene scripts de arranque.`);
    }
    if (!service.networks?.length) {
      warnings.push(`${service.name}: no tiene redes asociadas.`);
    }
    return warnings;
  });

export const validateAppConfiguration = (
  payload: CreateAppDto,
  alerts: AlertCreateDto[]
): AppConfigurationValidation => {
  if (!payload.name) {
    return {
      valid: false,
      issue: {
        message: "No se detectó un nombre de aplicación.",
        title: "Validación Requerida",
        field: "app-name",
      },
    };
  }

  const services = payload.services ?? [];
  if (services.length === 0) {
    return {
      valid: false,
      issue: {
        message: "No se detectaron servicios en el diagrama. Agrega al menos un servicio para crear la aplicación.",
        title: "Validación Requerida",
      },
    };
  }

  const unnamedServiceIndex = services.findIndex((service) => !service.name?.trim());
  if (unnamedServiceIndex !== -1) {
    return {
      valid: false,
      issue: {
        message: "Todos los servicios deben tener un nombre definido.",
        title: "Validación Requerida",
        field: "service-name",
        serviceIndex: unnamedServiceIndex,
      },
    };
  }

  const serviceWithoutImageIndex = services.findIndex((service) => !service.image);
  if (serviceWithoutImageIndex !== -1) {
    return {
      valid: false,
      issue: {
        message: "Todos los servicios deben tener una imagen definida.",
        title: "Validación Requerida",
        field: "service-image",
        serviceIndex: serviceWithoutImageIndex,
      },
    };
  }

  const appEnvironmentIssue = validateEnvironment(
    payload.environment,
    "app-environment"
  );
  if (appEnvironmentIssue) {
    return { valid: false, issue: appEnvironmentIssue };
  }

  for (const [serviceIndex, service] of services.entries()) {
    const environmentIssue = validateEnvironment(
      service.environment,
      "service-environment",
      serviceIndex
    );
    if (environmentIssue) {
      return { valid: false, issue: environmentIssue };
    }

    for (const volume of service.volumes ?? []) {
      const volumeIssue = validateVolume(volume, serviceIndex);
      if (volumeIssue) {
        return { valid: false, issue: volumeIssue };
      }
    }

    const hasUnnamedNetwork = (service.networks ?? []).some((network) => {
      const name = getNetworkName(network);
      return typeof name !== "string" || name.trim() === "";
    });
    if (hasUnnamedNetwork) {
      return {
        valid: false,
        issue: {
          message: "Todas las redes deben tener un nombre definido.",
          title: "Validación Requerida",
          field: "network-name",
          serviceIndex,
        },
      };
    }
  }

  const alertsIssue = validateAlerts(alerts);
  if (alertsIssue) {
    return { valid: false, issue: alertsIssue };
  }

  return { valid: true, warnings: getWarnings(services) };
};
