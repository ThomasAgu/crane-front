"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleButton from "../../../components/ui/GoogleButton";
import LoginForm from "../../../components/forms/LoginForm";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function LoginPage() {
  const googleClientId = "56654961319-23esh0hk9lkqdcjpedc0s3mjksapf2g4.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthLayout title="Iniciar Sesión">
        <GoogleButton text="Iniciar sesión con Google" />
        <div className="my-4 text-gray-400 font-medium text-sm">O</div>
        <LoginForm />
      </AuthLayout>
    </GoogleOAuthProvider>
  );
}