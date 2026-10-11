import type { Validator } from "./ValidatorInterface";

const isPortNumber = (value: string) => {
  if (!/^\d+$/.test(value)) return false;

  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
};

export const isValidPortList = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  if (!value.trim()) return true;

  return value.split(",").every((entry) => {
    const mapping = entry.trim().split(":");
    if (mapping.length > 2 || mapping.some((port) => !isPortNumber(port))) {
      return false;
    }

    return mapping.length === 1 || Number(mapping[0]) > 1023;
  });
};

export const portsValidator: Validator = {
  isValid: isValidPortList,
  message:
    "Usa puertos entre 1 y 65535 (ej.: 8080 o 8080:80). El puerto de la máquina debe ser mayor a 1023.",
};
