import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RepositoryService } from "@/lib/api/repositoryService";
import type { onHoldRepositoryDto, RepositoryDto } from "@/lib/dto/RepositoryDto";
import type { FilterType } from "@/lib/helper/FilterType";

export function useStore() {
  const router = useRouter();
  const [storeItems, setStoreItems] = useState<RepositoryDto[]>([]);
  const [onHoldStoreItems, setOnHoldStoreItems] = useState<onHoldRepositoryDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("best_rated");
  const [loading, setLoading] = useState(true);
  const [selectedDockerImages, setSelectedDockerImages] = useState<string[]>([]);
  const [isDockerFilterOpen, setIsDockerFilterOpen] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const fetchRepositories = useCallback(async () => {
    setLoading(true);
    try {
      const repositories = await RepositoryService.getRepositories();
      setStoreItems(repositories.filter((repository) => repository.state === "approved"));
      setOnHoldStoreItems(repositories.filter((repository) => repository.state === "pending"));
    } catch (error) {
      console.error("Error al cargar las aplicaciones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRepositories();
  }, [fetchRepositories]);

  const allDockerImages = useMemo(() => {
    const images = new Set<string>();
    storeItems.forEach((item) => {
      item.services?.split(",").forEach((service) => {
        if (service.trim()) images.add(service.trim());
      });
    });
    return Array.from(images).sort();
  }, [storeItems]);

  const displayedItems = useMemo(() => {
    if (showPending) {
      return onHoldStoreItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    let filtered = storeItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (selectedDockerImages.length > 0) {
      filtered = filtered.filter((item) => {
        const appImages = item.services.split(",").map((service) => service.trim());
        return selectedDockerImages.every((image) => appImages.includes(image));
      });
    }

    switch (filterType) {
      case "best_rated":
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "favourites":
        filtered.sort((a, b) => b.favourites - a.favourites);
        break;
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
    }

    return filtered;
  }, [filterType, onHoldStoreItems, searchTerm, selectedDockerImages, showPending, storeItems]);

  const updateItemInList = useCallback((updatedItem: RepositoryDto) => {
    setStoreItems((currentItems) =>
      currentItems.map((item) => item.id === updatedItem.id ? updatedItem : item),
    );
  }, []);

  const handleVote = useCallback(async (appId: number, type: "up" | "down") => {
    const updatedItem = type === "up"
      ? await RepositoryService.voteUpRepository(appId.toString())
      : await RepositoryService.voteDownRepository(appId.toString());
    updateItemInList(updatedItem);
  }, [updateItemInList]);

  const handleToggleFavorite = useCallback(async (appId: number) => {
    const updatedItem = await RepositoryService.favouriteRepository(appId.toString());
    updateItemInList(updatedItem);
  }, [updateItemInList]);

  const handleDownload = useCallback(async (appId: number) => {
    const updatedItem = await RepositoryService.downloadRepository(appId.toString());
    updateItemInList(updatedItem);
    router.push("/laboratory/");
  }, [router, updateItemInList]);

  const handleViewDetails = useCallback((repositoryId: number) => {
    router.push(`/store/${repositoryId}`);
  }, [router]);

  const handleApprove = useCallback(async (appId: number) => {
    try {
      const updatedItem = await RepositoryService.approveRepository(appId.toString());
      setOnHoldStoreItems((currentItems) => currentItems.filter((item) => item.id !== appId));
      setStoreItems((currentItems) => [...currentItems, updatedItem]);
    } catch (error) {
      console.error("Error approving repository:", error);
    }
  }, []);

  const handleReject = useCallback(async (appId: number) => {
    try {
      await RepositoryService.rejectRepository(appId.toString());
      setOnHoldStoreItems((currentItems) => currentItems.filter((item) => item.id !== appId));
    } catch (error) {
      console.error("Error rejecting repository:", error);
    }
  }, []);

  return {
    allDockerImages,
    displayedItems,
    filterType,
    handleApprove,
    handleDownload,
    handleReject,
    handleToggleFavorite,
    handleViewDetails,
    handleVote,
    isDockerFilterOpen,
    loading,
    pendingCount: onHoldStoreItems.length,
    searchTerm,
    selectedDockerImages,
    setFilterType,
    setIsDockerFilterOpen,
    setSearchTerm,
    setSelectedDockerImages,
    setShowPending,
    showPending,
  };
}