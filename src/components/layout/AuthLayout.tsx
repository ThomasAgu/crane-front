import Image from "next/image";
import logo from "../../public/logo.svg";
import logotiny from "../../public/logotiny.svg";
import styles from "./AuthLayout.module.css"

type AuthLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen">
      <div className="flex w-full">
        {/* Columna izquierda */}
        <div className="w-full lg:w-1/2 bg-white">
          <div className="absolute flex flex-row items-center justify-start p-2 gap-2">
            <Image src={logotiny} alt="Logo tiny" width={50} />
            <p className="logo-text-crane">CRANE</p>
          </div>

          <div className="flex flex-col h-full w-full justify-center items-center p-8">
            <h1 className="text-2xl font-bold text-darkest mb-6">{title}</h1>
            {children}
          </div>
        </div>

        {/* Columna derecha */}
        <div className={styles.rightColumn}>
          <div className={styles.logoContainer}>
            <Image
              src={logo}
              alt="Logo grande"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
