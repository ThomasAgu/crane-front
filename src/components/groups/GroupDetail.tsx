'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupDto, UserGroupDto } from '@/lib/dto/GroupDto';
import { UserDataDto } from '@/lib/dto/UserDto';
import { GroupService } from '@/lib/api/groupService';
import { UserService } from '@/lib/api/userService';
import { ArrowLeft } from 'lucide-react';
import GroupMemberManager from './GroupMemberManager';
import Loader from '@/components/ui/Loader';
import styles from './GroupDetail.module.css';

interface GroupDetailProps {
  groupId: string;
}

export default function GroupDetail({ groupId }: GroupDetailProps) {
  const router = useRouter();
  const [group, setGroup] = useState<GroupDto | null>(null);
  const [groupMembers, setGroupMembers] = useState<UserDataDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GroupService.getGroup(groupId);
        setGroup(data);
        setGroupMembers(data.user_groups.map((el) => el.user));
      } catch (err) {
        setError('Error al cargar el grupo');
        console.error('Error loading group:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAddMember = async (userId: number, gId: number) => {
    try {
      const data: UserGroupDto = { user_id: userId, group_id: gId, role_id: 1 };
      await GroupService.addUserFromGroup(data);

      const users = await UserService.getAll();
      const newMember = users.find(u => u.id === userId);
      if (newMember) {
        setGroupMembers([...groupMembers, newMember]);
      }
    } catch (err) {
      console.error('Error adding member:', err);
      throw err;
    }
  };

  const handleRemoveMember = async (userId: number, gId: number) => {
    try {
      const data: UserGroupDto = { user_id: userId, group_id: gId, role_id: 0 };
      await GroupService.removeUserFromGroup(data);
      const result = groupMembers.filter(m => m.id !== userId);
      
      setGroupMembers(result);
    } catch (err) {
      console.error('Error removing member:', err);
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
  if (!dateString || dateString.startsWith('1969') || dateString.startsWith('1970')) {
    return 'Sin registrar';
  }
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Sin registrar';
  }
};

  if (loading) {
    return <Loader />;
  }

  if (error || !group) {
    return (
      <div className={styles.detailError}>
        <p>{error || 'Grupo no encontrado'}</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles.groupDetailContainer}>
      <div className={styles.detailHeader}>
        <h1>{group.name}</h1>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.groupInfo}>
          <div className={styles.infoSection}>
            <h2>Información del Grupo</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Nombre</label>
                <p>{group.name}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Descripción</label>
                <p>{group.description}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Creado</label>
                <p>{formatDate(group.created_at)}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Última actualización</label>
                <p>{formatDate(group.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        <GroupMemberManager
          groupId={group.id}
          groupMembers={groupMembers}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      </div>
    </div>
  );
}
