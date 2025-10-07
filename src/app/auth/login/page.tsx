import GoogleButton from "../../../components/ui/GoogleButton";
import LoginForm from "../../../components/forms/LoginForm";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar Sesión">
      <GoogleButton text="Iniciar sesión con Google" />
      <div className="my-4">O</div>
      <LoginForm />
    </AuthLayout>
  );
}
