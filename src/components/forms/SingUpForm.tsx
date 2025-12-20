'use client';
import styles from './LoginForm.module.css'
import person from '../../public/person.svg';
import lock from '../../public/lock.svg';
import mail from '../../public/mail.svg';
import InputText from './InputText';
import Loader from '../ui/Loader';
import { AuthService } from '@/src/lib/api/authService';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import { emailValidator } from '@/src/lib/validators/EmailValidator';
import { matchPasswordValidator } from '@/src/lib/validators/MatchPasswordValidator';

type SingupData = {
  email: string;
  full_name: string;
  password: string;
  repeatedPassword: string;
}

class SingupForm {
  data: SingupData;
  errors: Record<string, string | null> = {};

  constructor(initial: SingupData = { email: '', full_name: '', password: '', repeatedPassword: '' }) {
    this.data = {
      email: initial.email,
      full_name: initial.full_name,
      password: initial.password,
      repeatedPassword: initial.repeatedPassword,
    };
  }

  update<K extends keyof SingupData>(key: K, value: SingupData[K]) {
    this.data = { ...this.data, [key]: value };
    return this.data;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [formObj] = useState(() => new SingupForm());
  const [state, setState] = useState<SingupData>(formObj.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const [inputValidity, setInputValidity] = useState({
    email: false,
    password: false,
    full_name: false,
    repeatedPassword: false,
  });

  const updateValidity = (field: keyof typeof inputValidity, isValid: boolean) => {
    setInputValidity(prev => ({ ...prev, [field]: isValid }));
  };

  const update = <K extends keyof SingupData>(key: K, value: SingupData[K]) => {
    formObj.update(key, value);
    setState({ ...formObj.data });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowErrors(true);
    const allValid = Object.values(inputValidity).every(Boolean);
    if (!allValid) {
      console.log('no se envi')
      return;
    }

    setLoading(true);
    try {
      const data = await AuthService.create(formObj.data);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta")
    } finally {
      setLoading(false);
    }
  };

  return (
     <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <InputText
          label={'Email'}
          type={'text'}
          placeholder={'correousuario@gmail.com'}
          value={state.email}
          setValue={(v) => update('email', v)}
          imagesrc={mail}
          submitValidators={[requiredValidator, emailValidator]}
          showErrors={showErrors}
          imagealt={'Correo o nombre de usuario'}
          setShowError={setShowErrors}
          onValidityChange={(valid) => updateValidity('email', valid)} 
        />

        <InputText
          label={'Nombre de usuario'}
          type={'text'}
          placeholder={'Nombre de usuario'}
          value={state.full_name}
          setValue={(v) => update('full_name', v)}
          imagesrc={person}
          submitValidators={[requiredValidator]}
          showErrors={showErrors}
          imagealt={'Nombre de usuario'}
          setShowError={setShowErrors}
          onValidityChange={(valid) => updateValidity('full_name', valid)}
        />

        <InputText
          label={'Contraseña'}
          type={'password'}
          placeholder={'*********'}
          value={state.password}
          setValue={(v) => update('password', v)}
          imagesrc={lock}
          submitValidators={[requiredValidator]}
          showErrors={showErrors}
          imagealt={'Contraseña'}
          setShowError={setShowErrors}
          onValidityChange={(valid) => updateValidity('password', valid)}
        />
          
        <InputText
          label={'Repetir contraseña'}
          type={'password'}
          placeholder={'*********'}
          value={state.repeatedPassword}
          setValue={(v) => update('repeatedPassword', v)}
          imagesrc={lock}
          liveValidators={[matchPasswordValidator(state.password)]}
          submitValidators={[requiredValidator]}
          showErrors={showErrors}
          imagealt={'Contraseña'}
          setShowError={setShowErrors}
          onValidityChange={(valid) => updateValidity('repeatedPassword', valid)}
        />  
          
        <div className={styles.errorMessage}>{error}</div>
        
        <div className="flex justify-center">
          <Loader loading={loading} />
        </div>

        <button
          type="submit"
          className="btn-primary"
        >
          Crear cuenta
        </button>

        <p className="text-sm text-center mt-4">¿Ya tenés cuenta?{' '} <a href="/auth/login" className="text-blue-500 underlines ">iniciar sesion</a></p>
      </form>
  );
}
