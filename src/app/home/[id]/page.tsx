'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NavBar from '../../../components/layout/NavBar'
import { getApp } from '@/src/lib/api/AppService' 
import type { AppDto } from '@/src/lib/dto/AppDto'

export default function AppDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const [app, setApp] = useState<AppDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getApp(id)
        setApp(data)
      } catch (err) {
        console.error(`Error al obtener la aplicación ${id}:`, err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  return (
    <NavBar>
      <main className="min-h-screen w-screen p-6 bg-gray-50">
        {loading ? (
          <p>Cargando detalles...</p>
        ) : app ? (
          <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{app.name}</h1>
            <ul className="space-y-2 text-gray-700">
              <li><strong>ID:</strong> {app.id}</li>
              <li><strong>Escala mínima:</strong> {app.min_scale ?? 'N/A'}</li>
              <li><strong>Escala actual:</strong> {app.current_scale ?? 'N/A'}</li>
              <li><strong>Escala máxima:</strong> {app.max_scale ?? 'N/A'}</li>
              <li><strong>Creado:</strong> {app.created_at ? new Date(app.created_at).toLocaleString() : 'Desconocido'}</li>
              <li><strong>Actualizado:</strong> {app.updated_at ? new Date(app.updated_at).toLocaleString() : 'N/A'}</li>
            </ul>
          </div>
        ) : (
          <p>No se encontró la aplicación.</p>
        )}
      </main>
    </NavBar>
  )
}
