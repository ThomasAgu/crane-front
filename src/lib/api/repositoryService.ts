import apiRequest from "./apiClient";
import { RepositoryDto, CreateRepositoryDto } from "../dto/RepositoryDto";

//GET
const getRepositories = () => apiRequest<RepositoryDto[]>("/repository");

const getRepository = (id: string) => apiRequest<RepositoryDto>(`/repository/${id}`);

//POST
const createRepository = (data: CreateRepositoryDto) =>
  apiRequest<RepositoryDto>("/repository", "POST", data);

const voteUpRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/vote_up`, "POST");

const voteDownRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/vote_down`, "POST");

const favouriteRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/favourite`, "POST");

const downloadRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/download`, "POST");

const approveRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/approve`, "POST");

const rejectRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}/reject`, "POST");

//DELETE
const deleteRepository = (id: string) =>
  apiRequest<RepositoryDto>(`/repository/${id}`, "DELETE");

export const RepositoryService = {
  getRepositories,
  getRepository,
  createRepository,
  voteUpRepository,
  voteDownRepository,
  favouriteRepository,
  downloadRepository,
  approveRepository,
  rejectRepository,
  deleteRepository
}