import { StoreApp, initialStoreItems } from '../../lib/helper/StoreItems' 

let storeItemsData: StoreApp[] = initialStoreItems;

const StoreService = {
  getApps: async (): Promise<StoreApp[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return storeItemsData;
  },

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

      storeItemsData = [
        ...storeItemsData.slice(0, appIndex),
        newApp,
        ...storeItemsData.slice(appIndex + 1),
      ];
    }

    return storeItemsData; 
  },

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
      
      console.log(`Descargando aplicación con ID: ${appId}`);
    }
    
    return storeItemsData;
  },
};

export default StoreService;