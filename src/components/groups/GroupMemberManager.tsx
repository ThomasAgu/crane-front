'use client'

import { useState, useEffect } from 'react';
import { UserDataDto } from '@/lib/dto/UserDto';
import { UserService } from '@/lib/api/userService';
import { Plus, Trash2 } from 'lucide-react';
import DeleteModal from '@/components/ui/DeleteModal';
import styles from './GroupMemberManager.module.css';
import { RequirePermission } from '../layout/RequirePermission';

interface GroupMemberManagerProps {
  groupId: number;
  groupMembers: UserDataDto[];
  onAddMember: (userId: number, groupId: number) => Promise<void>;
  onRemoveMember: (userId: number, groupId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function GroupMemberManager({
  groupId,
  groupMembers,
  onAddMember,
  onRemoveMember,
  isLoading = false,
}: GroupMemberManagerProps) {
  const [allUsers, setAllUsers] = useState<UserDataDto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemberToDelete, setSelectedMemberToDelete] = useState<UserDataDto | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserService.getAll();
        setAllUsers(users);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Error al cargar los usuarios');
      }
    };

    fetchUsers();
  }, []);

  // Get users available to add (not already in group)
  const availableUsers = allUsers.filter(
    user => !groupMembers.some(member => member.id === user.id)
  );

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    setError(null);
    try {
      await onAddMember(parseInt(selectedUserId), groupId);
      setSelectedUserId('');
    } catch (err) {
      setError('Error al agregar miembro');
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (member: UserDataDto) => {
    setSelectedMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMemberToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await onRemoveMember(selectedMemberToDelete.id, groupId);
      setShowDeleteModal(false);
      setSelectedMemberToDelete(null);
    } catch (err) {
      setError('Error al eliminar miembro');
      console.error('Error removing member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.memberManagerSection}>
      <h3>Miembros del Grupo</h3>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <RequirePermission object="GROUPS" action="POST">
        <div className={styles.addMemberForm}>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={loading || availableUsers.length === 0}
            className={styles.memberSelect}
          >
            <option value="">
              {availableUsers.length === 0
                ? 'No hay usuarios disponibles'
                : 'Selecciona un usuario para agregar'}
            </option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
              <button
              onClick={handleAddMember}
              disabled={!selectedUserId || loading}
              className={styles.addMemberButton}
              >
                <Plus size={18} />
                Agregar
              </button>
        </div>
      </RequirePermission>
      <div className={styles.membersList}>
        {groupMembers.length === 0 ? (
          <p className={styles.emptyMembers}>Este grupo no tiene miembros aún</p>
        ) : (
          <ul>
            {groupMembers.map((member) => {
              const initial = member.email ? member.email.charAt(0) : 'U';
              
              return (
                <li key={member.id} className={styles.memberItem}>
                  <div className={styles.memberInfoWrapper}>
                    <div className={styles.avatarFallback}>{initial}</div>
                    <span className={styles.memberEmail}>{member.email}</span>
                  </div>
                  <RequirePermission object="GROUPS" action="DELETE">
                    <button
                    onClick={() => openDeleteModal(member)}
                    disabled={loading}
                    className={styles.removeMemberButton}
                    title="Eliminar miembro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </RequirePermission>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showDeleteModal && selectedMemberToDelete && (
        <DeleteModal
          itemName={selectedMemberToDelete.email}
          itemType="miembros del grupo"
          deleteFunction={handleConfirmDelete}
          setActive={setShowDeleteModal}
        />
      )}
    </div>
  );
}
