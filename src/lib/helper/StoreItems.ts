// Biblioteca para agregar datos de prueba de la store compartida
// Para esta etapa vamos a usar datos de prueba
// types.ts

export interface AppInfo {
  id: number;
  name: string;
  // Puedes añadir más campos como 'description', 'icon', etc.
}

export interface StoreApp {
  id: number;
  app: AppInfo;
  votes_down: number;
  votes_up: number;
  favourites: number;
  downloads: number;
  isFavorite: boolean; // Para manejar el estado de favorito del usuario
}

export type FilterType = 'none' | 'best_rated' | 'favourites' | 'downloads';

// Datos de ejemplo
export const initialStoreItems: StoreApp[] = [
  {
    id: 1,
    app: { id: 101, name: 'Anachi Editor' },
    votes_down: 30,
    votes_up: 150,
    favourites: 100,
    downloads: 500,
    isFavorite: false,
  },
  {
    
    id: 2,
    app: { id: 102, name: 'Secure Vault' },
    votes_down: 10,
    votes_up: 200,
    favourites: 50,
    downloads: 1200,
    isFavorite: true,
  },
  {
    id: 3,
    app: { id: 103, name: 'QuickPlanner' },
    votes_down: 5,
    votes_up: 90,
    favourites: 250,
    downloads: 800,
    isFavorite: false,
  },
];