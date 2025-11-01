// services/dockerHubService.ts
// TODO: Cambiar esta implementación para que use la API oficial de Docker Hub cuando sea posible.
export async function searchDockerImages(query: string) {
  if (!query) return [];

  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = `https://hub.docker.com/v2/search/repositories/?query=${query}`;
  const res = await fetch(proxyUrl + encodeURIComponent(targetUrl));  
  if (!res.ok) {
    console.error("Error al buscar imágenes de Docker Hub:", res.statusText);
    return [];
  }

  const data = await res.json();
  const parsed = JSON.parse(data.contents); // la respuesta real está dentro de `contents`

  return parsed.results.map((item: any) => ({
    name: item.repo_name,
    description: item.short_description,
    official: item.is_official,
    pulls: item.pull_count,
  }));
}