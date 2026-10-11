import React from 'react';
import styles from './CraneLoader.module.css';

interface CraneLoaderProps {
  loading?: boolean;
  text?: string;
  subtext?: string;
  className?: string;
}

export default function CraneLoader({ 
  loading = true,
  text = "Creando los contenedores...", 
  subtext = "Configurando el entorno de laboratorio, esto puede tardar unos segundos.",
  className = "" 
}: CraneLoaderProps) {
  if (!loading) return null;

  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-[var(--surface)] ${className}`}>
      <div className="w-full max-w-[400px] h-[400px] flex items-center justify-center my-2">
        <svg viewBox="0 0 300 220" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3259E6" />
              <stop offset="100%" stopColor="#4961BA" />
            </linearGradient>
            <linearGradient id="boxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3259E6" />
              <stop offset="100%" stopColor="#505E91" />
            </linearGradient>
            <linearGradient id="boxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4961BA" />
              <stop offset="100%" stopColor="#262933" />
            </linearGradient>
          </defs>

          {/* Ground rail */}
          <line x1="20" y1="195" x2="280" y2="195" stroke="#D4D4D4" strokeWidth="4" strokeLinecap="round" />

          {/* Tower Structure */}
          <line x1="70" y1="195" x2="95" y2="65" stroke="#3259E6" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="195" x2="105" y2="65" stroke="#4961BA" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="150" x2="102" y2="130" stroke="#505E91" strokeWidth="2" opacity="0.5" />
          <line x1="84" y1="110" x2="103" y2="95" stroke="#505E91" strokeWidth="2" opacity="0.5" />

          {/* Cabin & Boom */}
          <rect x="90" y="55" width="22" height="20" rx="3" fill="#262933" />
          <line x1="50" y1="65" x2="235" y2="65" stroke="#3259E6" strokeWidth="5" strokeLinecap="round" />
          <rect x="40" y="55" width="20" height="14" rx="2" fill="#34363B" />

          {/* Trolley (se mueve horizontalmente de izquierda a derecha) */}
          <g className={styles.trolley}>
            <rect x="110" y="61" width="16" height="8" rx="2" fill="#34363B" />
            
            {/* Hook (se mueve verticalmente hacia arriba y abajo) */}
            <g className={styles.hook}>
              <line x1="118" y1="69" x2="118" y2="135" stroke="#505E91" strokeWidth="2" />
              <rect x="108" y="135" width="20" height="4" rx="1" fill="#262933" />
              
              {/* Contenedor 1 (activo en la primera mitad del ciclo) */}
              <g className={styles.box1}>
                <rect x="104" y="139" width="28" height="18" rx="2" fill="url(#boxGrad1)" />
              </g>
            </g>
          </g>
        </svg>
      </div>
      
      <div className="text-center space-y-1 mt-2">
        <h2 className="text-2xl font-semibold text-darkest">
          {text}
        </h2>
        <p className="text-center text-gray-600 min-h-[24px]">
          {subtext}
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-full animate-pulse bg-[var(--primary-blue,#3259E6)]" />
        </div>
      </div>
    </div>
  );
}