import fs from 'fs';
import path from 'path';

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export function getDocsSections(): DocSection[] {
  // Grabs readmes
  const introduccion = path.join(process.cwd(), 'src/app/README.md');
  const homePath = path.join(process.cwd(), 'src/app/home/README.md');
  const labPath = path.join(process.cwd(), 'src/app/laboratory/README.md');
  const storePath = path.join(process.cwd(), 'src/app/store/README.md');

  // Read readmes or provide fallback content if they don't exist
  const introduccionfile = fs.existsSync(introduccion) ? fs.readFileSync(introduccion, 'utf-8') : '# Introducción\nNo se encontró el archivo.';
  const home = fs.existsSync(homePath) ? fs.readFileSync(homePath, 'utf-8') : '# Introducción\nNo se encontró el archivo.';
  const labContent= fs.existsSync(labPath) ? fs.readFileSync(labPath, 'utf-8') : '# Laboratorio\nNo se encontró el archivo.';
  const repoContent = fs.existsSync(storePath) ? fs.readFileSync(storePath, 'utf-8') : '# Repositorio\nNo se encontró el archivo.';

  // Construye las secciones de la documentación
  return [
    {
      id: 'introduccion',
      title: 'Introducción',
      icon: '📘',
      content: introduccionfile,
    },
    {
      id: 'intro',
      title: 'Dashboard',
      icon: '🚀',
      content: home,
    },
    {
      id: 'laboratorio',
      title: 'Laboratorio',
      icon: '🛠️',
      content: labContent,
    },
    {
      id: 'repositorio',
      title: 'Repositorio',
      icon: '🌐',
      content: repoContent,
    },
  ];
}