'use client';
import NavBar from '../../components/layout/NavBar';
import FlowChart from '../../components/laboratory/FlowChart';
import TemplateSelector from '@/src/components/ui/TemplateSelector';
import { useEffect, useState } from 'react';
import { AppService } from '@/src/lib/api/appService';
import { AppDto } from '@/src/lib/dto/AppDto';

export default function HomePage() {
    const [popUp, setPopUp] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<AppDto | null>(null);
    const [apps, setApps] = useState<AppDto[]>([]);
    
   useEffect(() => {
    async function fetchData() {
      try {
        const data = await AppService.getAll();
        setApps(data);
      } catch (err) {
        console.error("Error cargando las apps:", err);
      }
    }
    fetchData();
  }, []);
    


    return (
        <NavBar>
            <main className="flex min-h-screen">
                {popUp && 
                    <TemplateSelector 
                        setPopUp={setPopUp} 
                        setSelectedTemplate={setSelectedTemplate}
                        setSelectedApp={setSelectedApp}
                        apps={apps}
                    />
                }
                <FlowChart
                    selectedTemplate={selectedTemplate}
                    selectedApp={selectedApp}
                />
            </main>
        </NavBar>
    );
}

/*
1. Faltaria agregar el selector de proyectos previos
*/
