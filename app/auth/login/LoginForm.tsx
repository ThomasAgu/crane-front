'use client';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import mail from '../../public/mail.svg';
import lock from '../../public/lock.svg';


export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: lógica de login
    console.log('Login con:', email, password);
    router.push('/home'); // reemplaza '/dashboard' con tu ruta
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <label className="auth-form-label">Email o usuario <span className="required-mark">*</span></label>
          <div className="auth-form-input-wrapper">
            <Image
                src={mail}
                alt="Correo o nombre de usuario"
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

          <button
            type="submit"
            className="btn-primary"
          >
            Iniciar Sesión
          </button>

          <p className="text-sm text-center mt-4">
            ¿No tenés cuenta?{' '}
            <a href="/auth/singup" className="text-blue-500 underline">
              crear cuenta
            </a>
          </p></form>
  );
}
