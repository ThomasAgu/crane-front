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
  const encodedImageName = imageName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return apiRequest<ImageDetails>(`/docker-hub/${encodedImageName}/details`, "GET", undefined, false);
};

export const DockerHubService = {
  searchDockerImages,
  getImageDetails,
};