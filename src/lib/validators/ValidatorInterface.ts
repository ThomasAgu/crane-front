export interface Validator {
  isValid: (value: string, formValues?: Record<string, string>) => boolean;
  message: string;
}
