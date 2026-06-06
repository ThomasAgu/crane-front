'use client';
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  expanded: boolean;
}

const NotificationBell = ({ expanded }: NotificationBellProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  debugger
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el popup al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read_by_user === b.read_by_user) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return a.read_by_user ? 1 : -1;
  });

  return (
    <div className="w-full relative shrink-0" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 rounded-lg cursor-pointer text-white p-2 transition-all duration-200
          ${isOpen ? 'bg-slate-700/50' : 'hover:bg-white/5'}
          ${expanded ? "w-full justify-start" : "justify-center"}
        `}
      >
        <div className="relative flex items-center justify-center h-[50px] w-[50px] shrink-0">
          <Bell className="text-2xl select-none" />
          
          {/* Badge de cantidad con color rojo vibrante */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Texto indicativo solo si el menú lateral está expandido */}
        {expanded && (
          <div className="flex flex-col text-left leading-tight overflow-hidden-ellipsis">
            <span className="text-sm font-medium truncate">Notificaciones</span>
            <span className="text-xs text-gray-400 truncate">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Al día'}
            </span>
          </div>
        )}
      </div>

      {/* Menú Desplegable (Dropdown Popup) tipo Slate */}
      {isOpen && (
        <div 
          className={`
            absolute bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 flex flex-col w-80
            ${expanded ? "bottom-16 left-0 w-full" : "bottom-0 left-16"}
          `}
        >
          {/* Encabezado del Dropdown */}
          <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-lg">
            <span className="font-semibold text-sm text-gray-200">Notificaciones</span>
            {unreadCount > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Cuerpo - Listado de Notificaciones */}
          <div className="flex-1 overflow-y-auto max-h-[280px] divide-y divide-slate-700/60 no-scrollbar">
            {sortedNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">
                No tienes notificaciones pendientes
              </div>
            ) : (
              sortedNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 transition-colors flex justify-between items-start gap-2 hover:bg-slate-700/30 ${!notif.read_by_user ? 'bg-blue-500/5' : ''}`}
                >
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => !notif.read_by_user && markAsRead(notif.id)}
                  >
                    <p className={`text-xs ${!notif.read_by_user ? 'text-white font-medium' : 'text-gray-300'}`}>
                      {notif.name.length > 60 ? notif.name.slice(0, 57) + '...' : notif.name}
                    </p>
                    {notif.description && (
                      <p className="text-[11px] text-gray-400 mt-0.5 font-normal line-clamp-2">
                        {notif.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Acciones de cada notificación */}
                  <div className="flex gap-1 shrink-0 pt-0.5">
                    {!notif.read_by_user && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        title="Marcar como leída"
                        className="text-gray-400 hover:text-blue-400 p-1 text-xs transition-colors"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      onClick={() => removeNotification(notif.id)}
                      title="Eliminar"
                      className="text-gray-400 hover:text-red-400 p-1 text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;