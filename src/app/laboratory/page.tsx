'use client';
import NavBar from '../../components/layout/NavBar';
import FlowChart from '../../components/laboratory/FlowChart';
import TemplateSelector from '@/components/ui/TemplateSelector';
import { useLaboratory } from '@/hooks/useLaboratory';

export default function LaboratoryPage() {
    const { 
        apps, 
        popUp, 
        setPopUp, 
        selectedTemplate, 
        setSelectedTemplate, 
        selectedApp, 
        setSelectedApp 
    } = useLaboratory();

    return (
        <NavBar>
            <main className="flex min-h-screen">
                {popUp && (
                    <TemplateSelector 
                        setPopUp={setPopUp} 
                        setSelectedTemplate={setSelectedTemplate}
                        setSelectedApp={setSelectedApp}
                        apps={apps}
                    />
                )}
                
                <FlowChart
                    selectedTemplate={selectedTemplate}
                    selectedApp={selectedApp}
                />
            </main>
        </NavBar>
    );
}