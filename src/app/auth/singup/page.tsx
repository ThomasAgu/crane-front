import GoogleButton from "../../../components/ui/GoogleButton";
import SingUpForm from "../../../components/forms/SingUpForm";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Crear cuenta">
      <GoogleButton text="Crear cuenta con Google" />
      <div className="my-4">O</div>
      <SingUpForm />
    </AuthLayout>
  );
}
