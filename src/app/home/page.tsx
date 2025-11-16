'use client'
import { useEffect, useState } from 'react'
import NavBar from '../../components/layout/NavBar'
import Dashboard from '../../components/ui/Dashboard'
import { getApps } from '@/src/lib/api/appService'
import { AppDto } from '@/src/lib/dto/AppDto'
import styles from './home.module.css' 
import { useRouter } from 'next/navigation'
import Loader from '@/src/components/ui/Loader'

export default function HomePage() {
  const [apps, setApps] = useState<AppDto[]>([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getApps()
        setApps(data)
      } catch (err) {
        console.error('Error cargando las apps:', err)
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [])

  const handleClick = () => {
    router.push(`/apps/create`)
  }

  const handleUpdate = async () => {
    const data = await getApps();
    setApps(data);
  } ;

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <h1 className="text-3xl font-bold mt-6 text-darkest">Home</h1> 
        {loading ? (
          <div className='mt-6'><Loader loading={loading} width={80} height={80} /></div>
        ) : (
          <Dashboard apps={apps} onUpdate={handleUpdate}/>
        )}
      </main>
    </NavBar>
  )
}
