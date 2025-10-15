import { Validator } from "./ValidatorInterface";

export const emailValidator: Validator = {
  isValid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  message: 'El correo electrónico no tiene un formato válido',
};
