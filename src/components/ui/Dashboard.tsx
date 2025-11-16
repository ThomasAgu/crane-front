'use client'

import DashboardItem from './DashboardItem'
import type { AppDto } from '@/src/lib/dto/AppDto'

interface DashboardProps {
  apps: AppDto[];
  onUpdate: CallableFunction
}

export default function Dashboard({ apps, onUpdate }: DashboardProps) {
  if (!apps || apps.length === 0) {
    return <p className="text-gray-500">No hay aplicaciones disponibles</p>
  }

  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        py-6
      "
    >
      {apps.map(app => (
        <DashboardItem key={app.id} app={app} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
