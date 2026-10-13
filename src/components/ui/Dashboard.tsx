'use client'

import DashboardItem from './DashboardItem'
import type { AppDto } from '@/lib/dto/AppDto'

interface DashboardProps {
  apps: AppDto[];
  onUpdate: () => void | Promise<void>
  onDelete: (appId: AppDto['id']) => void
}

export default function Dashboard({ apps, onUpdate, onDelete }: DashboardProps) {
  if (!apps || apps.length === 0) {
    return <p className="text-gray-500">No hay aplicaciones disponibles</p>
  }

  return (
    <div
      className="
        text-left
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        py-6
      "
    >
      {apps.map(app => (
        <DashboardItem key={app.id} app={app} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}
