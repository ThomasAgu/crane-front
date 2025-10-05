import GoogleButton from "../GoogleButton";
import LoginForm from "./LoginForm";
import AuthLayout from "../AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar Sesión">
      <GoogleButton text="Iniciar sesión con Google" />
      <div className="my-4">O</div>
      <LoginForm />
    </AuthLayout>
  );
}
