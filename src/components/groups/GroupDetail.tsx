'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupDto, UserGroupDto } from '@/lib/dto/GroupDto';
import { UserDataDto } from '@/lib/dto/UserDto';
import { TaskDetailsDto, TaskDto } from '@/lib/dto/TaskDto';
import { GroupService } from '@/lib/api/groupService';
import { UserService } from '@/lib/api/userService';
import { ArrowLeft } from 'lucide-react';
import GroupMemberManager from './GroupMemberManager';
import GroupTaskManager from './GroupTaskManager';
import Loader from '@/components/ui/Loader';
import styles from './GroupDetail.module.css';
import { TaskService } from '@/lib/api/taskService';
import { AlertSnackbar } from '../ui/AlertSnackbar';
import { useAlert } from '../ui/AlertSnackbar';

interface GroupDetailProps {
  groupId: string;
}

export default function GroupDetail({ groupId }: GroupDetailProps) {
  const router = useRouter();
  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const [group, setGroup] = useState<GroupDto | null>(null);
  const [groupMembers, setGroupMembers] = useState<UserDataDto[]>([]);
  const [taskOptions, setTaskOptions] = useState<TaskDto[]>([]);
  const [groupTasks, setGroupTasks] = useState<TaskDetailsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GroupService.getGroup(groupId);
        const tasks = await TaskService.getTasks();
        setGroup(data);
        setGroupMembers(data.user_groups.map((el) => el.user));
        debugger
        setTaskOptions(tasks);
        setGroupTasks(data.tasks || []);
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
       showAlert(
        "Se agrego al usuario del grupo",
        "info",
        "Usuario agregado"
      )
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
      showAlert(
        "Se removio al usuario del grupo",
        "error",
        "Usuario removido"
      )
    } catch (err) {
      console.error('Error removing member:', err);
      throw err;
    }
  };

  const handleTaskAssigned = async () => {
    // Refresh group data to get updated tasks
    try {
      const data = await GroupService.getGroup(groupId);
      setGroupTasks(data.tasks || []);
      showAlert(
        "Se agrego la tarea al grupo",
        "info",
        "Tarea asignada"
      )
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    }
  };

  const handleTaskUnassigned = async () => {
    try {
      const data = await GroupService.getGroup(groupId);
      setGroupTasks(data.tasks || []);
      showAlert(
        "Se removio la tarea del grupo",
        "error",
        "Tarea removida"
      )
    } catch (err) {
      console.error('Error refreshing tasks:', err);
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

        <GroupTaskManager
          groupId={group.id}
          options={taskOptions}
          groupTasks={groupTasks}
          onTaskAssigned={handleTaskAssigned}
          onTaskUnassigned={handleTaskUnassigned}
        />
      </div>
      <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />    
    </div>
  );
}
