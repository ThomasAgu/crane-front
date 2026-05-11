import apiRequest from "./apiClient";

interface DockerImage {
  name: string;
  description: string;
  official: boolean;
  pulls: number;
}

interface ImageDetails {
  [key: string]: any;
}

const searchDockerImages = (query: string) => {
  return apiRequest<DockerImage[]>(`/docker-hub/search?query=${query}`, "GET", undefined, false);
}

const getImageDetails = (imageName: string) => {
  debugger;
  return apiRequest<ImageDetails>(`/docker-hub/${imageName}/details`, "GET", undefined, false);
};

export const DockerHubService = {
  searchDockerImages,
  getImageDetails,
};