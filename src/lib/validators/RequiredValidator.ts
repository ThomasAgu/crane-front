import { Validator } from './ValidatorInterface' 

export const requiredValidator: Validator = {
  isValid: (value) => value !== '',
  message: 'Este campo es obligatorio',
};
