'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import logotinywhite from "../../public/logoTinyWhite.svg";
import appIcon from "../../public/logo.svg";
import gear from "../../public/gear.svg";
import labs from "../../public/labs.svg";
import home from "../../public/home.svg";
import store from "../../public/store.svg";
import gear_active from "../../public/gear_active.svg";
import labs_active from "../../public/labs_active.svg";
import home_active from "../../public/home_active.svg";
import store_active from "../../public/store_active.svg";
import documentation from "../../public/documentation.svg";
import documentation_active from "../../public/documentation_active.svg";
import users from "../../public/users.svg";
import users_active from "../../public/users_active.svg";
import { usePermissions } from '@/hooks/usePermissions';
import NavItem from './NavItem';
import { RequirePermission } from "../../components/layout/RequirePermission";
import ProfileDropdown from './ProfileComponent';
import styles from "./NavBar.module.css"


interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { refreshPermissions } = usePermissions();

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    await refreshPermissions();     
    router.push("/auth/login");
  };

  return (
    <div className="flex">
      <nav
        className={`
           fixed top-0 left-0 h-screen 
           navBar p-4 transition-all duration-300
          flex flex-col gap-4
      ${expanded ? "w-60" : "w-20"}
        `}
      >
        <div onClick={() => setExpanded(!expanded)} className='flex row justify-between items-center w-full cursor-pointer shrink-0'>
          <Image src={logotinywhite} alt="Logo tiny" width={50} />
          {expanded && (
              <p className={styles.craneText}>CRANE</p>
          )}
        </div>

        <div className="w-full border white bg-white rounded shrink-0"></div>

        <div className="flex-1 flex flex-col gap-4 w-full overflow-y-auto no-scrollbar py-2">
          <NavItem href="/home" icon={home} iconActive={home_active} alt="Inicio" expanded={expanded} />
          
          <RequirePermission object="APPS" action="GET">
            <NavItem href="/laboratory" icon={labs} iconActive={labs_active} alt="Laboratorio" expanded={expanded} />
          </RequirePermission>
          
          <RequirePermission object="REPOSITORY" action="GET">
            <NavItem href="/store" icon={store} iconActive={store_active} alt="Repositorio" expanded={expanded} />
          </RequirePermission>
                    
          <RequirePermission object="USERS" action="GET">
            <NavItem href="/users" icon={users} iconActive={users_active} alt="Usuarios" expanded={expanded}/>
          </RequirePermission>
          
          <NavItem href="/docs" icon={documentation} iconActive={documentation_active} alt="Documentación" expanded={expanded}/>
        </div>

        <ProfileDropdown expanded={expanded} handleLogout={handleLogout} />
      </nav>

      <main className={`
        flex-1 ml-${expanded ? "48" : "20"} 
        overflow-y-auto
        `}>        
        {children}
      </main>
    </div>
  );
};

export default PrivateLayout;