// pages/store.tsx
"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import NavBar from '../../components/layout/NavBar';
import AppItem from './StoreItem';
import StoreService from '../services/StoreSercice';
import { StoreApp, FilterType } from '../../lib/helper/StoreItems'
import styles from './store.module.css';
import Loader
 from '@/src/components/ui/Loader';
const FilterBar: React.FC<{ currentFilter: FilterType, onFilterChange: (f: FilterType) => void }> = ({ currentFilter, onFilterChange }) => {
  
  const filters: { label: string, value: FilterType, ascendand: boolean }[] = [
    { label: 'Mejor Valoradas', value: 'best_rated', ascendand: true},
    { label: 'Favoritos', value: 'favourites', ascendand: true},
    { label: 'Más Descargadas', value: 'downloads', ascendand: true},
  ];
  return (
    <div className={styles.filterBar}>
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={currentFilter === filter.value ? styles.activeFilter : ''}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default function Store() {
  const [storeItems, setStoreItems] = useState<StoreApp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('best_rated');
  const [loading, setLoading] = useState(true);

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

  const displayedItems = useMemo(() => {
    let filtered = [...storeItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.app.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filterType) {
      case 'best_rated':
        filtered.sort((a, b) => (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down));
        break;
      case 'favourites':
        filtered.sort((a, b) => b.favourites - a.favourites);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
    }

    return filtered;
  }, [storeItems, searchTerm, filterType]);

  
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
    alert(`¡Descargando ${storeItems.find(a => a.id === appId)?.app.name || 'App'}!`);
  }, [storeItems]); 

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <h1 className="text-3xl font-bold mt-6 text-darkest">Repositorio</h1>
        <i> "No reinventes la rueda"</i> 
        <hr />
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Buscar aplicación por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div> Multiselector de imagenes de docker anachi </div>
          <FilterBar currentFilter={filterType} onFilterChange={setFilterType} />
        </div>
        
        <hr className={styles.divider} />
        {loading ? (
          <div className="mt-6">
            <Loader loading={loading} width={80} height={80} />
          </div>
        ) : (

          <div className={styles.appList}>
            {displayedItems.length > 0 ? (
              displayedItems.map(app => (
                <AppItem
                  key={app.id}
                  app={app}
                  onVote={handleVote}
                  onToggleFavorite={handleToggleFavorite}
                  onDownload={handleDownload}
                />
              ))
            ) : (
              <div className={styles.noResults}>Ups... No se encontraron resultados deseados...</div>
            )}
          </div>
        )}
      </main>
    </NavBar>
  );
}