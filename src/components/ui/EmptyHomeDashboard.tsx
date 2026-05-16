// components/EmptyHomeDashboard.tsx
import React from 'react';
import Link from 'next/link';
import { Home, FlaskConical, LibraryBig, User, Settings } from 'lucide-react';
import styles from './EmptyHomeDashboard.module.css';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  area: string;
}

type IconElement = React.ReactElement<{ size?: number | string }>;

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, href, area }) => (
  <Link href={href} className={`${styles[area]} ${styles.dashboardCard}`}>
    <div className={styles.headerContent}>
      <div className={styles.iconContainer}>
        {/* 2. Casteamos el icono como 'IconElement' para que TypeScript permita pasarle el size */}
        {React.cloneElement(icon as IconElement, { size: 32 })}
      </div>
      <h2 className="text-xl font-semibold text-darkest dark:text-gray-100">{title}</h2>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-base">{description}</p>
    <span className={styles.dashboardCardLink}>Ir a {title} →</span>
  </Link>
);


// Reordenado para que 'Laboratorio' sea el primero, seguido de 'Inicio', etc.
const dashboardItems: DashboardCardProps[] = [
  {
    icon: <FlaskConical />, 
    title: 'Laboratorio',
    description: '¡Empezá acá! Crea nuevas aplicaciones, edita proyectos existentes y prueba distintos escenarios antes de su despliegue.',
    href: '/laboratory',
    area: 'laboratorio',
  },
  {
    icon: <Home />,
    title: 'Inicio',
    description: 'El centro de control. Aquí se mostrarán todas tus aplicaciones, sus detalles, estadísticas y logs una vez creadas.',
    href: '/home', 
    area: 'inicio',
  },
  {
    icon: <LibraryBig />,
    title: 'Repositorio',
    description: 'Explora y descarga aplicaciones aportadas por la comunidad. También puedes subir tus propios proyectos.',
    href: '/store',
    area: 'repositorio',
  },
  {
    icon: <User />,
    title: 'Perfil',
    description: 'Gestiona tu información personal, actualiza tus datos y revisa tu actividad dentro de la plataforma.',
    href: '/perfil',
    area: 'perfil',
  },
  {
    icon: <Settings />,
    title: 'Configuración',
    description: 'Personaliza la experiencia de la plataforma, ajusta las preferencias y gestiona opciones avanzadas.',
    href: '/configuracion',
    area: 'configuracion',
  },
];

const EmptyHomeDashboard: React.FC = () => {
  return (
    <div className="mt-8 mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold mb-2 text-darkest dark:text-gray-100 text-center">
        ¡Bienvenido a CRANE!
      </h1>
      <p className="text-xl  mb-2 text-center">
        Empezá a gestionar tus aplicaciones de una manera más interactiva aprendiendo en el proceso.
      </p>
      <p className="text-lg font-medium  mb-8 text-center">
        ¿Qué es lo que vas a poder hacer aquí?
      </p>

      <div className={styles.dashboardGrid}>
        {dashboardItems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export default EmptyHomeDashboard;