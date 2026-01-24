'use client';
import { useRouter } from "next/navigation";
import { useForm } from '@/src/hooks/useForm';
import { AuthService } from '@/src/lib/api/authService';
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import { emailValidator } from '@/src/lib/validators/EmailValidator';
import { matchPasswordValidator } from '@/src/lib/validators/MatchPasswordValidator';

import InputText from './InputText';
import Loader from '../ui/Loader';
import styles from './LoginForm.module.css';

import person from '../../public/person.svg';
import lock from '../../public/lock.svg';
import mail from '../../public/mail.svg';

export default function SingUpForm() {
  const router = useRouter();

  const {
    data, updateField, updateValidity,
    showErrors, setShowErrors,
    loading, setLoading,
    apiError, setApiError, isFormValid
  } = useForm({
    email: '',
    full_name: '',
    password: '',
    repeatedPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!isFormValid) return;

    setLoading(true);
    try {
      const result = await AuthService.create(data);
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);
      router.push('/home');
    } catch (err: any) {
      setApiError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <InputText
        label="Email"
        type="text"
        placeholder={'correousuario@gmail.com'}
        value={data.email}
        setValue={(v) => updateField('email', v)}
        imagesrc={mail}
        imagealt="Correo o nombre de usuario"
        submitValidators={[requiredValidator, emailValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('email', valid)}
      />

      <InputText
        label="Nombre de usuario"
        type="text"
        placeholder={'Nombre de usuario'}
        value={data.full_name}
        setValue={(v) => updateField('full_name', v)}
        imagesrc={person}
        imagealt="Nombre de usuario"
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('full_name', valid)}
      />

      <InputText
        label="Contraseña"
        type="password"
        value={data.password}
        placeholder="********"
        setValue={(v) => updateField('password', v)}
        imagesrc={lock}
        imagealt="Contraseña"
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('password', valid)}
      />

      <InputText
        label="Repetir contraseña"
        type="password"
        placeholder="********"
        value={data.repeatedPassword}
        setValue={(v) => updateField('repeatedPassword', v)}
        imagesrc={lock}
        imagealt="Repetir contraseña"
        liveValidators={[matchPasswordValidator(data.password)]}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('repeatedPassword', valid)}
      />

      {apiError && <div className={styles.errorMessage}>{apiError}</div>}

      <div className="flex justify-center">
        <Loader loading={loading} />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        Crear cuenta
      </button>

      <p className="text-sm text-center mt-4">
        ¿Ya tenés cuenta?{' '}
        <a href="/auth/login" className="text-blue-500 underline">iniciar sesión</a>
      </p>
    </form>
  );
}