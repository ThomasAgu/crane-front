'use client'
import { useEffect, useState } from 'react'
import NavBar from '../../components/layout/NavBar'
import Dashboard from '../../components/ui/Dashboard'
import { getApps } from '@/src/lib/api/AppService'
import { AppDto } from '@/src/lib/dto/AppDto'
import styles from './home.module.css' 
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [apps, setApps] = useState<AppDto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getApps()
        setApps(data)
      } catch (err) {
        console.error('Error cargando las apps:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleClick = () => {
    router.push(`/apps/create`)
  }

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1> 
        <button onClick={handleClick} className="btn-primary" >Crear nuevo app</button>
        {loading ? (
          <p>Cargando aplicaciones...</p>
        ) : (
          <Dashboard apps={apps} />
        )}
      </main>
    </NavBar>
  )
}
