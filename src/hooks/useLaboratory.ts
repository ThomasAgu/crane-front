import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { AppService } from '@/lib/api/appService';
import { AppDto } from '@/lib/dto/AppDto';
import { APPS_QUERY_KEY } from "@/hooks/useApps";

export type SelectedAppMode = 'edit' | 'template' | null;

export function useLaboratory() {
    const searchParams = useSearchParams();
    const appId = searchParams.get('appId');
    const [popUp, setPopUp] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<AppDto | null>(null);
    const [selectedAppMode, setSelectedAppMode] = useState<SelectedAppMode>(null);
    const {
        data: apps = [],
        isFetching: loading,
        error,
    } = useQuery({
        queryKey: APPS_QUERY_KEY,
        queryFn: AppService.getAll,
    });

    useEffect(() => {
        if (!appId) return;

        const requestedApp = apps.find((app) => String(app.id) === appId);
        if (requestedApp) {
            setSelectedApp(requestedApp);
            setSelectedAppMode('edit');
            setPopUp(false);
        }
    }, [appId, apps]);

    const closePopUp = () => setPopUp(false);

    return {
        apps,
        loading,
        error: error instanceof Error ? error.message : null,
        popUp,
        setPopUp,
        selectedTemplate,
        setSelectedTemplate,
        selectedApp,
        setSelectedApp,
        selectedAppMode,
        setSelectedAppMode,
        closePopUp
    };
}