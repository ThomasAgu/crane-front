'use client';
import Image from "next/image";
import person from '../../public/person.svg';
import lock from '../../public/lock.svg';
import mail from '../../public/mail.svg';

import { useState } from 'react';
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: lógica de auth
    console.log('Login con:', email, userName, password);
    router.push('/home'); // reemplaza '/dashboard' con tu ruta
  };

  return (
     <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <label className="auth-form-label">Email <span className="required-mark">*</span></label>
          <div className="auth-form-input-wrapper">
            <Image
                src={mail}
                alt="Correo"
                width={30}
                height={30}
                className="auth-form-input-icon"
            />
            <input
                type="email"
                placeholder="correousuario@gmail.com"
                className="auth-form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
          </div>
        
          <label className="auth-form-label"> Nombre de usuario <span className="required-mark">*</span></label>
          <div className="auth-form-input-wrapper">
             <Image
                src={person}
                alt="Nombre de usuario"
                width={30}
                height={30}
                className="auth-form-input-icon"
            />
            <input
            type="text"
            placeholder="Nombre de usuario"
            className="auth-form-input"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            />  
          </div>
          
        <label className="auth-form-label">Contraseña <span className="required-mark">*</span></label> 
        <div className="auth-form-input-wrapper">
            <Image
                src={lock}
                alt="Contraseña"
                width={30}
                height={30}
                className="auth-form-input-icon"
            />

            <input
            type="password"
            placeholder="********"
            className="auth-form-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
          
          

        <label className="auth-form-label">Repetir contraseña <span className="required-mark">*</span></label>
        <div className="auth-form-input-wrapper">
            <Image
                src={lock}
                alt="Contraseña"
                width={30}
                height={30}
                className="auth-form-input-icon"
            />

            <input
                type="password"
                placeholder="********"
                className="auth-form-input"
                value={repeatedPassword}
                onChange={e => setRepeatedPassword(e.target.value)}
            />
        </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Crear cuenta
          </button>

          <p className="text-sm text-center mt-4">
            ¿Ya tenés cuenta?{' '}
            <a href="/auth/login" className="text-blue-500 underline">
              iniciar sesion
            </a>
          </p>
        </form>
  );
}
