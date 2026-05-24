"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleButton from "../../../components/ui/GoogleButton";
import LoginForm from "../../../components/forms/LoginForm";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <AuthLayout title="Iniciar Sesión">
        <GoogleButton text="Iniciar sesión con Google" />
        <div className="my-4 text-gray-400 font-medium text-sm">O</div>
        <LoginForm />
      </AuthLayout>
    </GoogleOAuthProvider>
  );
}