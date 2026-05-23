'use client';

import { usePathname } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: StaticImageData;
  iconActive: StaticImageData;
  alt: string;
  expanded: boolean;
}

const NavItem = ({ href, icon, iconActive, alt, expanded }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className='w-full'>
      <div
        className={`
          rounded-lg  transition-colors
          flex items-center gap-3 p-2 rounded-lg transition-all duration-200
          ${isActive ? 'bg-white' : ' hover:bg-white/10'}
          ${expanded ? "justify-start" : "justify-start"}
        `}
      >
        <Image
          src={isActive?  iconActive: icon}
          alt={alt}
          width={30}
          height={30}
          className='duration-200'
        />
        {expanded && <span className=
        {`
            transition-colors duration-200
            ${expanded && isActive ? "text-darkest" : "justify-start"}
          `}>{alt}</span>}
      </div>
    </Link>
  );
};

export default NavItem;
