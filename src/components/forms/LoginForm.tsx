'use client';
import styles from './LoginForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from "@/src/lib/api/authService";
import { emailValidator } from '@/src/lib/validators/EmailValidator';
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import InputText from './InputText';
import Loader from '../ui/Loader';
import mail from '../../public/mail.svg';
import lock from '../../public/lock.svg';

type LoginData = {
  email: string;
  password: string;
};

class LoginForm {
  data: LoginData;
  errors: Record<string, string | null> = {};

  constructor(initial: LoginData = { email: '', password: '' }) {
    this.data = {
      email: initial.email,
      password: initial.password,
    };
  }

  update<K extends keyof LoginData>(key: K, value: LoginData[K]) {
    this.data = { ...this.data, [key]: value };
    return this.data;
  }
}

export default function LoginFormComponent() {
  const router = useRouter();
  
  const [formObj] = useState(() => new LoginForm());
  const [state, setState] = useState<LoginData>(formObj.data);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [inputValidity, setInputValidity] = useState({
    email: false,
    password: false,
  });

  const updateValidity = (field: keyof typeof inputValidity, isValid: boolean) => {
    setInputValidity(prev => ({ ...prev, [field]: isValid }));
  };

  const update = <K extends keyof LoginData>(key: K, value: LoginData[K]) => {
    formObj.update(key, value);
    setState({ ...formObj.data });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    const allValid = Object.values(inputValidity).every(Boolean);

    if (!allValid) {
      console.log('no se envi')
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formObj.data);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      router.push("/home");
    } catch (err: any) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <InputText
        label="Email o usuario"
        type="text"
        placeholder="correousuario@gmail.com"
        value={state.email}
        setValue={(v) => update('email', v)}
        imagesrc={mail}
        submitValidators={[requiredValidator, emailValidator]}
        showErrors={showErrors}
        imagealt="Correo o nombre de usuario"
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('email', valid)}
      />

      <InputText
        label="Contraseña"
        type="password"
        placeholder="*********"
        value={state.password}
        setValue={(v) => update('password', v)}
        imagesrc={lock}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        imagealt="Contraseña"
        setShowError={setShowErrors}
        onValidityChange={(valid) => updateValidity('password', valid)} // 👈 NUEVO
      />

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className="flex justify-center">
        <Loader loading={loading} />
      </div>

      <button type="submit" className="btn-primary">
        Iniciar Sesión
      </button>

      <p className="text-sm text-center mt-4">
        ¿No tenés cuenta?{' '}
        <a href="/auth/singup" className="text-blue-500 underline">
          crear cuenta
        </a>
      </p>
    </form>
  );
}
