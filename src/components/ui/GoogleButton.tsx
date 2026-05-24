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
      const googleToken = tokenResponse.access_token;
     
      if (!googleToken) {
        throw new Error("No se recibió el access_token desde Google");
      }

      const result = await AuthService.googleLogin({
        access_token: googleToken
      });

      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("token_type", result.token_type);

      await refreshPermissions();
      router.push("/home");
    } 
    catch (err) {
      alert("Hubo un problema al sincronizar tu cuenta de Google con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }
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