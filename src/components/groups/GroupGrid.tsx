'use client'

import { GroupDto } from '@/lib/dto/GroupDto';
import GroupCard from './GroupCard';
import styles from './groups.module.css';

interface GroupGridProps {
  groups: GroupDto[];
  onDelete: (id: number) => void;
}

export default function GroupGrid({ groups, onDelete }: GroupGridProps) {
  if (groups.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay grupos disponibles. Crea uno para empezar.</p>
      </div>
    );
  }

  return (
    <div className={styles.groupGrid}>
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
