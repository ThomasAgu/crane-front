import { useState, useEffect, useMemo, useCallback } from 'react';
import StoreService from '../app/services/StoreSercice';
import { StoreApp, FilterType } from '../lib/helper/StoreItems'

export function useStore() {
  const [storeItems, setStoreItems] = useState<StoreApp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('best_rated');
  const [loading, setLoading] = useState(true);
  const [selectedDockerImages, setSelectedDockerImages] = useState<string[]>([]);
  const [isDockerFilterOpen, setIsDockerFilterOpen] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await StoreService.getApps();
        setStoreItems(apps);
      } catch (error) {
        console.error('Error al cargar las aplicaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const allDockerImages = useMemo(() => {
    const images = new Set<string>();
    storeItems.forEach(item => {
      item.app.services?.forEach(service => {
        if (service.image) images.add(service.image);
      });
    });
    return Array.from(images).sort();
  }, [storeItems]);

  const displayedItems = useMemo(() => {
    let filtered = [...storeItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.app.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDockerImages.length > 0) {
      filtered = filtered.filter(item => {
        const appImages = item.app.services?.map(s => s.image) || [];
        return selectedDockerImages.every(img => appImages.includes(img));
      });
    }

    const sortMap: Record<FilterType, (a: StoreApp, b: StoreApp) => number> = {
      best_rated: (a, b) => (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down),
      favourites: (a, b) => b.favourites - a.favourites,
      downloads: (a, b) => b.downloads - a.downloads,
    };

    return filtered.sort(sortMap[filterType]);
  }, [storeItems, searchTerm, filterType, selectedDockerImages]);

  const handleVote = useCallback(async (appId: number, type: 'up' | 'down') => {
    const updatedApps = await StoreService.updateVote(appId, type);
    setStoreItems(updatedApps);
  }, []);

  const handleToggleFavorite = useCallback(async (appId: number) => {
    const updatedApps = await StoreService.toggleFavorite(appId);
    setStoreItems(updatedApps);
  }, []);

  const handleDownload = useCallback(async (appId: number) => {
    const updatedApps = await StoreService.registerDownload(appId);
    setStoreItems(updatedApps);
  }, []);

  return {
    loading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    displayedItems,
    allDockerImages,
    selectedDockerImages,
    setSelectedDockerImages,
    isDockerFilterOpen,
    setIsDockerFilterOpen,
    handleVote,
    handleToggleFavorite,
    handleDownload
  };
}