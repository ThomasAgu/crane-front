import { Validator } from './ValidatorInterface' 

export const PathValidator: Validator = {
  isValid: (value: unknown): boolean => {
    if (typeof value !== 'string' || value.trim() === '') return false;
    const normalized = value.replace(/\\/g, '/').replace(/\/+/g, '/').trim();
    
    if (!normalized.startsWith('/')) return false;
    const invalidChars = /[<>:"|?*\x00]/;
    if (invalidChars.test(normalized)) return false;
    if (/\s$/.test(normalized)) return false;
    if (normalized.includes('/../') || normalized.includes('/./')) return false;
    if (normalized.startsWith('//')) return false;
    return true;
  },
  message: 'El valor debe ser una ruta absoluta válida que comience con "/".',
};