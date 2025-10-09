'use client';
import NavBar from '../../components/layout/NavBar';
import FlowChart from '../../components/laboratory/FlowChart';
import TemplateSelector from '@/src/components/ui/TemplateSelector';
import { useState } from 'react';

export default function HomePage() {
    const [popUp, setPopUp] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    

    return (
        <NavBar>
            <main className="flex min-h-screen">
                {popUp && 
                    <TemplateSelector 
                        setPopUp={setPopUp} 
                        setSelectedTemplate={setSelectedTemplate}
                    />
                }
                <FlowChart
                    selectedTemplate={selectedTemplate}
                />
            </main>
        </NavBar>
    );
}

/*
1. Faltaria agregar el selector de templates y/o el selector de proyectos previos
2. Depende lo que elija pinta en el flowchart.
*/
