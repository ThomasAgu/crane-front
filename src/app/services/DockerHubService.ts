import { DockerHubService as DockerHubAPI } from "@/lib/api/dockerHubService";

/**
 * Search for Docker images on Docker Hub through the backend API
 */
export async function searchDockerImages(query: string) {
  if (!query) return [];

  try {
    return await DockerHubAPI.searchDockerImages(query);
  } catch (error) {
    console.error("Error searching Docker images:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific Docker image
 */
export async function getImageDetails(imageName: string) {
  if (!imageName) return null;

  try {
    return await DockerHubAPI.getImageDetails(imageName);
  } catch (error) {
    console.error("Error fetching image details:", error);
    return null;
  }
}