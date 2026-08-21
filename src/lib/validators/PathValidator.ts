import { Validator } from './ValidatorInterface' 

export const PathValidator: Validator = {
  isValid: (value: unknown): boolean => {
    if (typeof value !== 'string' || value.trim() === '') return false;
    
    const paths = value.split(':');

    if (paths.some((p) => p.trim() === '')) return false;

    return paths.every((singlePath) => {
      const normalized = singlePath.replace(/\\/g, '/').replace(/\/+/g, '/').trim();

      if (!normalized.startsWith('/')) return false;

      const invalidChars = /[<>"|?*\x00]/;
      if (invalidChars.test(normalized)) return false;

      if (/\s$/.test(normalized)) return false;
      if (normalized.includes('/../') || normalized.includes('/./') || normalized.endsWith('/..') || normalized.endsWith('/.')) return false;
      if (normalized.startsWith('//')) return false;

      return true;
    });
  },
  message: 'Debe ser una ruta absoluta válida (ej: "/path") o una asociación de rutas (ej: "/host:/container").',
};