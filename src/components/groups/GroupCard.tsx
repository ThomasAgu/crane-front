'use client'

import { GroupDto } from '@/lib/dto/GroupDto';
import { useRouter } from 'next/navigation';
import { Trash2, Users } from 'lucide-react';
import styles from './groups.module.css';

interface GroupCardProps {
  group: GroupDto;
  onDelete: (id: number) => void;
}

export default function GroupCard({ group, onDelete }: GroupCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/groups/${group.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(group.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalMembers = group.user_groups?.length || 0;

  return (
    <div 
      className={styles.groupCard}
      onClick={handleCardClick}
    >
      <div>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{group.name}</h3>
        </div>
        <p className={styles.cardDescription}>
          {group.description || 'Sin descripción'}
        </p>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.memberCount} title="Miembros del grupo">
          <Users size={14} className="text-gray-400" />
          <span>{totalMembers} {totalMembers === 1 ? 'miembro' : 'miembros'}</span>
        </div>
        
        <span className={styles.dateCreated}>
          Creado: {formatDate(group.created_at)}
        </span>

        <button
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          title="Eliminar grupo"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}