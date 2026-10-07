// components/EmptyHomeDashboard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, FlaskConical, Home, LibraryBig, User, UsersRoundIcon } from 'lucide-react';
import styles from './EmptyHomeDashboard.module.css';
import { useUserId } from '@/hooks/useUserId';
import logotinywhite from "../../public/logoTinyWhite.svg";
import Image from 'next/image';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  featured?: boolean;
}

type IconElement = React.ReactElement<{ size?: number | string }>;

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, href, featured }) => (
  <Link
    href={href}
    className={`${styles.dashboardCard} ${featured ? styles.featuredCard : ''}`}
  >
    <div className={styles.headerContent}>
      <div className={styles.iconContainer}>
        {React.cloneElement(icon as IconElement, { size: 24 })}
      </div>
      <h2>{title}</h2>
    </div>
    <p className={styles.cardDescription}>{description}</p>
    <span className={styles.dashboardCardLink}>
      {featured ? 'Crear mi primera aplicación' : `Ir a ${title}`}
      <ArrowUpRight aria-hidden="true" size={17} />
    </span>
  </Link>
);

const EmptyHomeDashboard: React.FC = () => {
  const userId = useUserId();
  const dashboardItems: DashboardCardProps[] = [
    {
      icon: <FlaskConical />,
      title: 'Laboratorio',
      description: 'Crea tu primera aplicación, prueba ideas y configura cada detalle antes de ponerla en marcha.',
      href: '/laboratory',
      featured: true,
    },
    {
      icon: <LibraryBig />,
      title: 'Repositorio',
      description: 'Descubre aplicaciones de la comunidad o comparte tus propios proyectos.',
      href: '/store',
    },
    {
      icon: <User />,
      title: 'Perfil',
      description: 'Actualiza tus datos personales y consulta tu actividad en la plataforma.',
      href: `/profile/${userId}`,
    },
    {
      icon: <FileText />,
      title: 'Documentación',
      description: 'Consulta guías y referencias para aprovechar todas las herramientas de CRANE.',
      href: '/docs',
    },
    {
      icon: <UsersRoundIcon />,
      title: 'Grupos y Comunidad',
      description: 'Conecta con otros usuarios, comparte experiencias y participa en la comunidad.',
      href: '/groups',
    }
  ];

  return (
    <section className={styles.emptyDashboard} aria-labelledby="empty-dashboard-title">
      <header className={styles.welcome}>
        <h1 id="empty-dashboard-title">Creá, Aprendé y Compartí con <span className={styles.eyebrow}>CRANE</span> <div className={styles.logo}><Image src={logotinywhite} className={styles.logoImage} alt="Logo tiny" width={50} /></div></h1>
        <p className={styles.welcomeDescription}>
          Todavía no tenes aplicaciones. Explora las herramientas y crea la primera cuando estés listo.
        </p>
      </header>

      <section aria-labelledby="dashboard-sections-title">
        <h2 className={styles.sectionTitle} id="dashboard-sections-title">Explora la plataforma</h2>
        <div className={styles.dashboardGrid}>
          {dashboardItems.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </section>
  );
};

export default EmptyHomeDashboard;