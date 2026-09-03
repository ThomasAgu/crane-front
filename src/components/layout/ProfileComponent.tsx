'use client';
import profile from "../../public/profile.svg";
import profile_active from "../../public/profile_active.svg";

import Image from "next/image";


import { useState } from 'react';
import Link from 'next/link';
import { useUserId } from '@/hooks/useUserId';

interface ProfileDropdownProps {
  expanded: boolean;
  handleLogout: () => Promise<void>;
}

const ProfileDropdown = ({ expanded, handleLogout }: ProfileDropdownProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const userId = useUserId();
  const profileHref = userId ? `/profile/${userId}` : '/profile';

  return (
    <div className="mt-auto w-full relative pt-4 border-t border-white/10 shrink-0">
      <div 
        onClick={() => setProfileOpen(!profileOpen)}
        className={`
          flex items-center gap-3 rounded-lg cursor-pointer text-white 
          ${expanded ? "w-full justify-start" : "justify-center"}
        `}
      >
        <div 
        className={`
          flex items-center gap-3 p-2 rounded-lg transition-all duration-200
          ${profileOpen ? 'bg-white' : ''}
          ${expanded ? "justify-start" : "justify-start"}
        `}
        >
          <Image
                    src={profileOpen ? profile_active : profile}
                    alt="Profile"
                    width={50}
                    height={50}
                    className='duration-200'
                  />
        </div>

        {/* Texto del perfil - Solo visible si el Nav está expandido */}
        {expanded && (
          <div className="flex flex-col text-left leading-tight overflow-hidden">
            <span className="text-sm font-medium truncate">Mi Perfil</span>
            <span className="text-xs text-gray-400 truncate">Ver opciones</span>
          </div>
        )}
      </div>

      {/* Menú Desplegable (Dropdown Popup) */}
      {profileOpen && (
        <div 
          className={`
            absolute bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1 z-50 min-w-[160px]
            ${expanded ? "bottom-14 left-0 w-full" : "bottom-0 left-16"}
          `}
        >
          <Link href={profileHref} onClick={() => setProfileOpen(false)}>
            <button className="w-full text-left text-sm text-gray-200 hover:bg-slate-700 px-3 py-2 rounded transition-colors">
              Perfil
            </button>
          </Link>
          
          <div className="h-[1px] bg-slate-700 my-1"></div>

          <Link href="/auth/login" onClick={() => setProfileOpen(false)}>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-400 hover:bg-red-500/10 px-3 py-2 rounded transition-colors font-medium"
            >
              Cerrar Sesión
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;