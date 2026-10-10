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
        setSelectedApp,
        selectedAppMode,
        setSelectedAppMode,
    } = useLaboratory();

    return (
        <NavBar>
            <main className="flex min-h-screen">
                {popUp && (
                    <TemplateSelector 
                        setPopUp={setPopUp} 
                        setSelectedTemplate={setSelectedTemplate}
                        setSelectedApp={setSelectedApp}
                        setSelectedAppMode={setSelectedAppMode}
                        apps={apps}
                    />
                )}
                
                <FlowChart
                    selectedTemplate={selectedTemplate}
                    selectedApp={selectedApp}
                    selectedAppMode={selectedAppMode}
                />
            </main>
        </NavBar>
    );
}