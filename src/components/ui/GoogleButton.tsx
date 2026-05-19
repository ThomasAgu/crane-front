"use client";

import google from '../../public/google.svg';
import Image from "next/image";
import styles from "./GoogleButton.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthService } from "@/lib/api/authService";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GoogleButtonProps = {
  text: string;
};

export default function GoogleButton({ text }: GoogleButtonProps) {
  const router = useRouter();
  const { refreshPermissions } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // 2. CORRECCIÓN CRÍTICA: En el flujo implícito, el token viene en 'access_token'.
        // Este es el string largo que tu FastAPI necesita para validar contra GOOGLE_TOKENINFO_URL.
        debugger
        const googleToken = tokenResponse.access_token;

        if (!googleToken) {
          throw new Error("No se recibió el token desde Google");
        }

        // Enviamos el token real a tu FastAPI
        const result = await AuthService.googleLogin({
          id_token: googleToken 
        });
        // Guardamos en LocalStorage tal cual lo hace tu LoginForm clásico
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("token_type", result.token_type);

        // Refrescamos tus permisos globales
        await refreshPermissions();

        // Redirigimos al home
        router.push("/home");
      } catch (err) {
        console.error("Error autenticando con FastAPI:", err);
        alert("Hubo un problema al sincronizar tu cuenta de Google con el servidor.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Login de Google cancelado o fallido:", errorResponse);
    },
  });

  return (
    <button 
      type="button"
      className={styles.GoogleButton}
      onClick={() => loginWithGoogle()}
      disabled={isLoading}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    >
      <span className="mr-2">
        <Image
          src={google}
          alt="Google"
          width={30}
          height={30}
        />
      </span> 
      {isLoading ? "Iniciando sesión..." : text}
    </button>
  );
}