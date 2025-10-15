import { Validator } from "./ValidatorInterface";

export const matchPasswordValidator = (otherField: string): Validator => ({
  isValid: (value) =>{ return  value === otherField},
  message: 'Las contraseñas deben ser iguales',
});