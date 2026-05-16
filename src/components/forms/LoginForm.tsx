'use client';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/authService';
import { emailValidator } from '@/lib/validators/EmailValidator';
import { requiredValidator } from '@/lib/validators/RequiredValidator';
import InputText from './InputText';
import Loader from '../ui/Loader';
import mail from '../../public/mail.svg';
import lock from '../../public/lock.svg';
import styles from './LoginForm.module.css';

import { useForm } from '@/hooks/useForm';
import { usePermissions } from '@/hooks/usePermissions';

export default function LoginForm() {
  const router = useRouter();
  const { refreshPermissions } = usePermissions();
  
  const {
    data, updateField, updateValidity,
    showErrors, setShowErrors,
    loading, setLoading,
    apiError, setApiError, isFormValid
  } = useForm({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!isFormValid) return;

    setLoading(true);
    try {
      const result = await AuthService.login(data);
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);
      await refreshPermissions();
      router.push("/home");
    } catch (err) {
      setApiError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left">
      <InputText
        label="Email o usuario"
        type='text'
        placeholder="correousuario@gmail.com"
        value={data.email}
        setValue={(v) => updateField('email', v)}
        imagesrc={mail}
        imagealt="Correo o nombre de usuario"
        submitValidators={[requiredValidator, emailValidator]}
        showErrors={showErrors}
        onValidityChange={(valid) => updateValidity('email', valid)}
        setShowError={setShowErrors}
      />

      <InputText
        label="Contraseña"
        type="password"
        placeholder="*********"
        value={data.password}
        setValue={(v) => updateField('password', v)}
        imagesrc={lock}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        imagealt="Contraseña"
        onValidityChange={(valid) => updateValidity('password', valid)}
        setShowError={setShowErrors}
      />

      {apiError && <div className={styles.errorMessage}>{apiError}</div>}

      <div className="flex justify-center">
        <Loader loading={loading} />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        Iniciar Sesión
      </button>

      <p className="text-sm text-darkest text-center mt-4">
        ¿No tenés cuenta?{' '}
        <a href="/auth/singup" className="text-blue-500 underline">
          crear cuenta
        </a>
      </p>
    </form>
  );
}