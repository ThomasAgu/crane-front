'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { UserService } from '@/lib/api/userService';
import type { UserDataDtoDetails } from '@/lib/dto/UserDto';

interface ProfileViewProps {
  userId: string;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'No disponible';
  return new Date(value).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default function ProfileView({ userId }: ProfileViewProps) {
  const [user, setUser] = useState<UserDataDtoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const profile = await UserService.get(userId);
        setUser(profile);
      } catch (requestError) {
        console.error('Error al cargar el perfil:', requestError);
        setError('No se pudo cargar el perfil del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const repositories = useMemo(
    () => user?.repositories ?? user?.publishedRepositories ?? [],
    [user]
  );

  const stats = useMemo(() => {
    const approved = repositories.filter((repo) => repo.state === 'approved').length;
    const pending = repositories.filter((repo) => repo.state === 'pending').length;
    const rejected = repositories.filter((repo) => repo.state === 'rejected').length;

    return {
      groups: user?.groups?.length ?? 0,
      repositories: repositories.length,
      approved,
      pending,
      rejected,
    };
  }, [repositories, user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-3xl border border-slate-200 bg-[var(--surface)]/80 p-8 shadow-sm">
            <div className="mb-6 h-8 w-56 rounded bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
          {error || 'Perfil no disponible.'}
        </div>
      </main>
    );
  }

  const initials = (user.full_name || user.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50 shadow-xl shadow-slate-300/30">
          <div className="flex flex-col gap-6 border-b border-slate-200 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Perfil</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">{user.full_name || user.email}</h1>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 md:self-auto">
              <span className={`h-2.5 w-2.5 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {user.is_active ? 'Activo' : 'Inactivo'}
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="text-sm text-slate-500">Grupos</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{stats.groups}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="text-sm text-slate-500">Repositorios</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{stats.repositories}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="text-sm text-slate-500">Aprobados</p>
              <p className="mt-3 text-3xl font-bold text-emerald-300">{stats.approved}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="text-sm text-slate-500">Pendientes</p>
              <p className="mt-3 text-3xl font-bold text-amber-300">{stats.pending}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-[var(--surface)]/90 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Grupos</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {stats.groups} total
              </span>
            </div>

            {user.groups?.length ? (
              <div className="space-y-4">
                {user.groups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-cyan-400 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{group.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{group.description || 'Sin descripción'}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        {group.user_groups?.length ?? 0} miembros
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Creado: {formatDate(group.created_at)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                Este usuario no pertenece a ningún grupo todavía.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[var(--surface)]/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Roles</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {user.roles?.length ? (
                user.roles.map((role) => (
                  <span
                    key={role.id}
                    className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200"
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Sin roles asignados.</span>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">ID de usuario</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">#{user.id}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-[var(--surface)]/90 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Repositorios</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {stats.repositories} registrados
            </span>
          </div>

          {repositories.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {repositories.map((repository) => (
                <Link
                  key={repository.id}
                  href={`/store/${repository.id}`}
                  className="block rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-blue-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-slate-900">{repository.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        repository.state === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : repository.state === 'pending'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-red-500/15 text-red-300'
                      }`}
                    >
                      {repository.state === 'approved'
                        ? 'Aprobado'
                        : 'Pendiente'
                      }
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{repository.description || 'Sin descripción'}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{repository.is_template ? 'Plantilla' : 'Aplicación'}</span>
                    <span>{repository.services || 'Sin servicios'}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Actualizado: {formatDate(repository.updated_at ?? repository.created_at)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Este usuario todavía no tiene repositorios publicados.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
