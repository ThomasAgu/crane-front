import GoogleButton from "../../../components/ui/GoogleButton";
import SingUpForm from "../../../components/forms/SingUpForm";
import AuthLayout from "../../../components/layout/AuthLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <AuthLayout title="Crear cuenta">
        <GoogleButton text="Crear cuenta con Google" />
        <div className="my-4">O</div>
        <SingUpForm />
      </AuthLayout>
    </GoogleOAuthProvider>
  );
}
