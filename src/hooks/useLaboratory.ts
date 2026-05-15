import { useState, useEffect } from 'react';
import { AppService } from '@/lib/api/appService';
import { AppDto } from '@/lib/dto/AppDto';

export function useLaboratory() {
    const [apps, setApps] = useState<AppDto[]>([]);
    const [popUp, setPopUp] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<AppDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await AppService.getAll();
                setApps(data);
            } catch (err) {
                console.error("Error cargando las apps:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const closePopUp = () => setPopUp(false);

    return {
        apps,
        loading,
        popUp,
        setPopUp,
        selectedTemplate,
        setSelectedTemplate,
        selectedApp,
        setSelectedApp,
        closePopUp
    };
}