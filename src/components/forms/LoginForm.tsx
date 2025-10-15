'use client';
import styles from './LoginForm.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from "@/src/lib/api/authService";
import { emailValidator } from '@/src/lib/validators/EmailValidator';
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import InputText from './InputText';

import mail from '../../public/mail.svg';
import lock from '../../public/lock.svg';


export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showErrors, setShowErrors] = useState(false);


  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowErrors(true);

    const allFieldsValid = [email, password].every(v => v.trim() !== '');
    if (!allFieldsValid) return;
    
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <InputText
        label={'Email o usuario'}
        type={'text'}
        placeholder={'correousuario@gmail.com'}
        value={email}
        setValue={setEmail}
        imagesrc={mail}
        submitValidators={[requiredValidator, emailValidator]}
        showErrors={showErrors}
        imagealt={'Correo o nombre de usuario'}
        setShowError={setShowErrors}
      />
      
      <InputText
        label={'Contraseña'}
        type={'password'}
        placeholder={'*********'}
        value={password}
        setValue={setPassword}
        imagesrc={lock}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        imagealt={'Contraseña'}
        setShowError={setShowErrors}
      />
          
      <div className={styles.errorMessage}>{error}</div>

      <button
        type="submit"
        className="btn-primary"
      >
        Iniciar Sesión
      </button>

      <p className="text-sm text-center mt-4"> ¿No tenés cuenta?{' '}<a href="/auth/singup" className="text-blue-500 underline">crear cuenta</a></p>
    </form>
  );
}
