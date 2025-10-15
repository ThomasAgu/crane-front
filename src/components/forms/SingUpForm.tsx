'use client';
import styles from './LoginForm.module.css'
import person from '../../public/person.svg';
import lock from '../../public/lock.svg';
import mail from '../../public/mail.svg';
import InputText from './InputText';
import { createUser } from "@/src/lib/api/authService";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import { emailValidator } from '@/src/lib/validators/EmailValidator';
import { matchPasswordValidator } from '@/src/lib/validators/MatchPasswordValidator';

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [full_name, setFull_name] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [error, setError] = useState('');

  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
      if (error) setError('');
    }, [email, full_name, password, repeatedPassword]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowErrors(true);
    
    const allFieldsValid = [email, full_name, password, repeatedPassword].every(v => v.trim() !== '');
    if (!allFieldsValid) return;

    try {
      const data = await createUser({full_name, email, password});
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta")
    } finally {
      setShowErrors(false);
    }
  };

  return (
     <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <InputText
          label={'Email'}
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
          label={'Nombre de usuario'}
          type={'text'}
          placeholder={'Nombre de usuario'}
          value={full_name}
          setValue={setFull_name}
          imagesrc={person}
          submitValidators={[requiredValidator]}
          showErrors={showErrors}
          imagealt={'Nombre de usuario'}
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
          
        <InputText
          label={'Repetir contraseña'}
          type={'password'}
          placeholder={'*********'}
          value={repeatedPassword}
          setValue={setRepeatedPassword}
          imagesrc={lock}
          liveValidators={[matchPasswordValidator(password)]}
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
          Crear cuenta
        </button>

        <p className="text-sm text-center mt-4">¿Ya tenés cuenta?{' '} <a href="/auth/login" className="text-blue-500 underlines ">iniciar sesion</a></p>
      </form>
  );
}
