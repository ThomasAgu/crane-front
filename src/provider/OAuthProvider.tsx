'use client';
import { AuthService } from '@/lib/api/authService';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const response = await AuthService.googleLogin({
        access_token: token
      });

      debugger
      // Guardamos el JWT propio de nuestra API
      const tokenLocal = response.data.access_token;
      localStorage.setItem('access_token', tokenLocal);

      // Redirigimos al Home o Dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al autenticar en el backend:', error);
      alert('Error al iniciar sesión con tu cuenta de Google.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h2>Iniciar Sesión</h2>
        
        {/* Botón oficial de Google que maneja el Pop-up de forma automática */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login de Google Fallido')}
          useOneTap // Opcional: Activa el inicio de sesión rápido en la esquina superior derecha
        />
      </div>
    </GoogleOAuthProvider>
  );
}