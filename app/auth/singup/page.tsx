import GoogleButton from "../GoogleButton";
import SingUpForm from "./SingUpForm";
import AuthLayout from "../AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Crear cuenta">
      <GoogleButton text="Crear cuenta con Google" />
      <div className="my-4">O</div>
      <SingUpForm />
    </AuthLayout>
  );
}
