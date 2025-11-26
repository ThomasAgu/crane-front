// Biblioteca para agregar datos de prueba de la store compartida
// Para esta etapa vamos a usar datos de prueba
// types.ts

export interface ServiceInfo {
  image: string
}

export interface AppInfo {
  id: number;
  name: string;
  services: ServiceInfo[]
}

export interface StoreApp {
  id: number;
  description: string;
  app: AppInfo;
  votes_down: number;
  votes_up: number;
  favourites: number;
  downloads: number;
  isFavorite: boolean;
}

export type FilterType = 'none' | 'best_rated' | 'favourites' | 'downloads';

export const initialStoreItems: StoreApp[] = [
  {
    id: 1,
    app: { 
      id: 101, 
      name: 'Simple Editor',
      services: [
        {
          image: "SQL"
        },
        {
          image: "Node"
        }
      ] 
    },
    description: "Simple Editor es un editor de codigo super interesante que pone el foco en el ser humano",
    votes_down: 30,
    votes_up: 150,
    favourites: 100,
    downloads: 500,
    isFavorite: false,
  },
  {
    
    id: 2,
    app: { 
      id: 102, 
      name: 'Secure Vault', 
      services: [
        {
          image: "Python"
        },
        {
          image: "MongoDB"
        },
        {
          image: "Ruby"
        }
      ]
    },
    description: "Bajo una filosofia muy interesamte. No entiendo. Ya lo vas a entender",
    votes_down: 10,
    votes_up: 200,
    favourites: 50,
    downloads: 1200,
    isFavorite: true,
  },
  {
    id: 3,
    app: { 
      id: 103, 
      name: 'QuickPlanner', 
     services: [
        {
          image: "Python"
        },
        {
          image: "MongoDB"
        },
        {
          image: "Ruby"
        }
      ] 
    },
    description: "Aca ya no se que poner zihahahahah zihahahah",
    votes_down: 5,
    votes_up: 90,
    favourites: 250,
    downloads: 800,
    isFavorite: false,
  },
];