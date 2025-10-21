'use client'

import DashboardItem from './DashboardItem'
import type { AppDto } from '@/src/lib/dto/AppDto'

interface DashboardProps {
  apps: AppDto[]
}

export default function Dashboard({ apps }: DashboardProps) {
  if (!apps || apps.length === 0) {
    return <p className="text-gray-500">No hay aplicaciones disponibles</p>
  }

  debugger
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl pt-4">
      {apps.map((app) => (
        <DashboardItem key={app.id ?? Math.random()} app={app} />
      ))}
    </div>
  )
}
