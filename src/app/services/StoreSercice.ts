// services/StoreService.ts
import { StoreApp, initialStoreItems } from '../../lib/helper/StoreItems' 

// ** SIMULACIÓN DE DATOS EN MEMORIA **
let storeItemsData: StoreApp[] = initialStoreItems;

const StoreService = {
  /**
   * Simula la obtención de la lista completa de aplicaciones.
   */
  getApps: async (): Promise<StoreApp[]> => {
    // Simular un retraso de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return storeItemsData;
  },

  /**
   * Actualiza el voto de una aplicación.
   */
  updateVote: async (appId: number, type: 'up' | 'down'): Promise<StoreApp[]> => {
    const appIndex = storeItemsData.findIndex(item => item.id === appId);

    if (appIndex !== -1) {
      const currentApp = storeItemsData[appIndex];
      const newApp = { ...currentApp };

      if (type === 'up') {
        newApp.votes_up += 1;
      } else {
        newApp.votes_down += 1;
      }

      // Actualizar el estado global simulado
      storeItemsData = [
        ...storeItemsData.slice(0, appIndex),
        newApp,
        ...storeItemsData.slice(appIndex + 1),
      ];
    }

    return storeItemsData; // Devuelve la lista actualizada para refrescar el estado de React
  },

  /**
   * Alterna el estado de favorito de una aplicación.
   */
  toggleFavorite: async (appId: number): Promise<StoreApp[]> => {
    const appIndex = storeItemsData.findIndex(item => item.id === appId);
    debugger
    if (appIndex !== -1) {
      const currentApp = storeItemsData[appIndex];
      const newApp = { 
        ...currentApp, 
        isFavorite: !currentApp.isFavorite,
        favourites: currentApp.isFavorite ? currentApp.favourites - 1 : currentApp.favourites + 1
      };
      
      storeItemsData = [
        ...storeItemsData.slice(0, appIndex),
        newApp,
        ...storeItemsData.slice(appIndex + 1),
      ];
    }
    
    return storeItemsData;
  },

  /**
   * Simula la descarga de una aplicación.
   */
  registerDownload: async (appId: number): Promise<StoreApp[]> => {
    const appIndex = storeItemsData.findIndex(item => item.id === appId);

    if (appIndex !== -1) {
      const currentApp = storeItemsData[appIndex];
      const newApp = { 
        ...currentApp, 
        downloads: currentApp.downloads + 1 
      };

      storeItemsData = [
        ...storeItemsData.slice(0, appIndex),
        newApp,
        ...storeItemsData.slice(appIndex + 1),
      ];
      
      // En una app real, aquí se iniciaría la descarga
      console.log(`Descargando aplicación con ID: ${appId}`);
    }
    
    return storeItemsData;
  },
};

export default StoreService;