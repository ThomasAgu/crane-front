'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logotinywhite from "../public/logoTinyWhite.svg";
import gear from "../public/gear.svg";
import labs from "../public/labs.svg";
import home from "../public/home.svg";
import store from "../public/store.svg";
import gear_active from "../public/gear_active.svg";
import labs_active from "../public/labs_active.svg";
import home_active from "../public/home_active.svg";
import store_active from "../public/store_active.svg";
import NavItem from './NavItem';

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex">
      <nav
        className={`
          sticky flex flex-col p-4 gap-4 navBar
          ${expanded ? "w-50 items-start" : "w-20 items-start"}
        `}
      >
        <div onClick={() => setExpanded(!expanded)} className='flex row justify-between items-center w-full'>
          <Image src={logotinywhite} alt="Logo tiny" width={50} />
          <p className="logo-text-crane-white">{expanded ? 'CRANE' : ''}</p>
        </div>

        <div className="w-full border white bg-white rounded"></div>

        <NavItem href="/home" icon={home} iconActive={home_active} alt="Inicio" expanded={expanded} />
        <NavItem href="/laboratory" icon={labs} iconActive={labs_active} alt="Laboratorio" expanded={expanded} />
        <NavItem href="/store" icon={store} iconActive={store_active} alt="Repositorio" expanded={expanded} />
        <NavItem href="/configure" icon={gear} iconActive={gear_active} alt="Configuracion" expanded={expanded} />

        <Link href="/auth/login" className="mt-auto w-full">
          <button
            className={`
              text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-all duration-200
              ${expanded ? "w-full" : "mx-auto"}
            `}
          >
            OUT
          </button>
        </Link>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default PrivateLayout;
