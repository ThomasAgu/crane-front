import { Validator } from "./ValidatorInterface";

export const ipv4Validator: Validator = {
  isValid: (value) =>{ 
    const re = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return re.test(value.trim());
  },
  message: 'La IP deben ser 4 partes de numeros de 0 a 255 separados por puntos',
};

export const maskValidator: Validator = {
  isValid: (value) => {
    const v = Number(value)
    return v >= 1 && v <= 32;
  },
  message: 'La máscara debe estar entre 1 y 32',
};