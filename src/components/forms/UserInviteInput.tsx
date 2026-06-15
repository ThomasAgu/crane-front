'use client'

import { useEffect, useRef, useState } from 'react';
import { UserDataDto } from '@/lib/dto/UserDto';
import { UserService } from '@/lib/api/userService';
import { X } from 'lucide-react';
import styles from './UserInviteInput.module.css';

interface UserInviteInputProps {
  selectedUsers: UserDataDto[];
  onAddUser: (user: UserDataDto) => void;
  onRemoveUser: (userId: number) => void;
  label?: string;
  placeholder?: string;
}

export default function UserInviteInput({
  selectedUsers,
  onAddUser,
  onRemoveUser,
  label = 'Agregar usuarios',
  placeholder = 'Busca por nombre o email...',
}: UserInviteInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<UserDataDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const users = await UserService.getAll();
        // Filter out already selected users
        const available = users.filter(
          u => !selectedUsers.some(su => su.id === u.id)
        );
        setSuggestions(available);
      } catch (err) {
        setError('Error al cargar usuarios');
        console.error('Error loading users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [selectedUsers]);

  // Filter suggestions based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      const available = suggestions.filter(
        u => !selectedUsers.some(su => su.id === u.id)
      );
      setSuggestions(available);
      return;
    }

    const filtered = suggestions.filter(
      u =>
        !selectedUsers.some(su => su.id === u.id) &&
        (u.email.toLowerCase().includes(inputValue.toLowerCase()) ||
          u.full_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          u.username?.toLowerCase().includes(inputValue.toLowerCase()))
    );
    setSuggestions(filtered);
  }, [inputValue, selectedUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddUser = (user: UserDataDto) => {
    onAddUser(user);
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveUser = (userId: number) => {
    onRemoveUser(userId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.inputWrapper}>
        {/* Selected Users Tags */}
        <div className={styles.selectedTags}>
          {selectedUsers.map(user => (
            <div key={user.id} className={styles.tag}>
              <span className={styles.tagText}>
                {user.full_name || user.email}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className={styles.tagRemove}
                aria-label={`Remover ${user.email}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && <span className={styles.errorText}>{error}</span>}

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className={styles.suggestionsContainer}>
          {isLoading ? (
            <div className={styles.loading}>Cargando usuarios...</div>
          ) : suggestions.length === 0 ? (
            <div className={styles.noResults}>
              {inputValue.trim() === ''
                ? 'No hay más usuarios disponibles'
                : 'No se encontraron usuarios'}
            </div>
          ) : (
            <ul className={styles.suggestionsList}>
              {suggestions.map(user => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleAddUser(user)}
                    className={styles.suggestionItem}
                  >
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>
                        {user.full_name || user.username}
                      </div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
