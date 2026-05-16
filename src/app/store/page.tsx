"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import NavBar from "../../components/layout/NavBar";
import AppItem from "./StoreItem";
import { FilterType } from "@/lib/helper/FilterType";
import DockerImageFilter from "@/components/ui/DockerImageFilter";
import styles from "./store.module.css";
import Loader from "@/components/ui/Loader";
import { Search } from "lucide-react";
import {
  onHoldRepositoryDto,
  RepositoryDto,
} from "@/lib/dto/RepositoryDto";
import { RepositoryService } from "@/lib/api/repositoryService";
import { useRouter } from "next/dist/client/components/navigation";
import { RequirePermission } from "@/components/layout/RequirePermission";
import { PendingItem } from "./PendingItem";

const FilterBar: React.FC<{
  currentFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  onDockerFilterClick: () => void;
  isDockerFilterActive: boolean;
  activeFilterCount: number;
  isShowPending: boolean;
}> = ({
  currentFilter,
  onFilterChange,
  onDockerFilterClick,
  isDockerFilterActive,
  activeFilterCount,
  isShowPending,
}) => {

  const filters: { label: string; value: FilterType; ascendand: boolean }[] = [
    { label: "Mejor Valoradas", value: "best_rated", ascendand: true },
    { label: "Favoritos", value: "favourites", ascendand: true },
    { label: "Más Descargadas", value: "downloads", ascendand: true },
  ];
  return (
    isShowPending ? <div className={styles.filterBar}></div> :
    <div className={styles.filterBar}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={currentFilter === filter.value ? styles.activeFilter : ""}
        >
          {filter.label}
        </button>
      ))}
      <button
        onClick={onDockerFilterClick}
        className={`${styles.dockerImagesButton} ${isDockerFilterActive ? styles.activeDockerFilter : ""}`}
      >
        Filtrar por imagen de docker
        {activeFilterCount > 0 && ` (${activeFilterCount})`}
      </button>
    </div>
  );
};

export default function Store() {
  const [storeItems, setStoreItems] = useState<RepositoryDto[]>([]);
  const [onHoldStoreItems, setOnHoldStoreItems] = useState<
    onHoldRepositoryDto[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("best_rated");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [selectedDockerImages, setSelectedDockerImages] = useState<string[]>(
    [],
  );
  const [isDockerFilterOpen, setIsDockerFilterOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await RepositoryService.getRepositories();
        setStoreItems(apps.filter((app) => app.state === "approved"));

        setPendingCount(apps.filter((app) => app.state === "pending").length);
        setOnHoldStoreItems(apps.filter((app) => app.state === "pending"));
      } catch (error) {
        console.error("Error al cargar las aplicaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const allDockerImages = useMemo(() => {
    const images = new Set<string>();

    storeItems.forEach((item) => {
      item.services.split(",").forEach((service) => {
        if (service.trim()) {
          images.add(service.trim());
        }
      });
    });
    return Array.from(images).sort();
  }, [storeItems]);

  const displayedItems = useMemo(() => {
    let filtered = [...storeItems];

    if (showPending) {
      return onHoldStoreItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDockerImages.length > 0) {
      filtered = filtered.filter((item) => {
        const appImages = item.services.split(",").map((s) => s.trim());
        return selectedDockerImages.every((selectedImage) =>
          appImages.includes(selectedImage),
        );
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
  }, [storeItems, searchTerm, filterType, selectedDockerImages, showPending]);

  const handleVote = useCallback(async (appId: number, type: "up" | "down") => {
    let updatedItem: RepositoryDto;
    if (type === "up") {
      updatedItem = await RepositoryService.voteUpRepository(appId.toString());
    } else {
      updatedItem = await RepositoryService.voteDownRepository(
        appId.toString(),
      );
    }

    updateItemInList(updatedItem);
  }, []);

  const updateItemInList = (updatedItem: RepositoryDto) => {
    setStoreItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  };

  const handleToggleFavorite = useCallback(async (appId: number) => {
    const updatedItem = await RepositoryService.favouriteRepository(
      appId.toString(),
    );
    updateItemInList(updatedItem);
  }, []);

  const handleDownload = useCallback(async (appId: number) => {
    const updatedItem = await RepositoryService.downloadRepository(
      appId.toString(),
    );
    updateItemInList(updatedItem);
    router.push(`/laboratory/`);
  }, []);

  const handleApprove = useCallback(async (appId: number) => {
    try {
      const updatedItem = await RepositoryService.approveRepository(
        appId.toString(),
      );

      setOnHoldStoreItems((prev) => prev.filter((item) => item.id !== appId));
      setStoreItems((prev) => [...prev, updatedItem]);
      setPendingCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error approving repository:", error);
    }
  }, []);

  const handleReject = useCallback(async (appId: number) => {
    try {      
      await RepositoryService.rejectRepository(appId.toString());
      setOnHoldStoreItems((prev) => prev.filter((item) => item.id !== appId));
      setStoreItems((prev) => [...prev]);
      setPendingCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error rejecting repository:", error);
    }
  }, []);

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <h1 className="text-3xl font-bold mt-6 text-darkest">Repositorio</h1>
        <i> "No reinventes la rueda"</i>
        <hr />
        <div className={styles.controls}>
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon} aria-hidden="true">
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="Buscar aplicación por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.dockerFilterWrapper}>
            <FilterBar
              currentFilter={filterType}
              onFilterChange={setFilterType}
              onDockerFilterClick={() => setIsDockerFilterOpen((prev) => !prev)}
              isDockerFilterActive={selectedDockerImages.length > 0}
              activeFilterCount={selectedDockerImages.length}
              isShowPending={showPending}
            />

            {isDockerFilterOpen && (
              <DockerImageFilter
                allImages={allDockerImages}
                selectedImages={selectedDockerImages}
                onSelectionChange={setSelectedDockerImages}
                onClose={() => setIsDockerFilterOpen(false)}
              />
            )}
          </div>

          <RequirePermission object="REPOSITORYMODERATOR" action="GET">
            <button
              className={styles.pendingFilter}
              onClick={() => setShowPending((prev) => !prev)}
            >
              {showPending
                ? "Volver"
                : "Pendientes"}
              {pendingCount > 0 && !showPending && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          </RequirePermission>
        </div>

        <hr className={styles.divider} />
        {loading ? (
          <div className="mt-6">
            <Loader loading={loading} width={80} height={80} />
          </div>
        ) : (
          <div className={styles.appList}>
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => {
                if (showPending) {
                  return (
                    <PendingItem
                      key={item.id}
                      item={item as onHoldRepositoryDto}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  );
                }
                return (
                  <AppItem
                    key={item.id}
                    item={item as RepositoryDto}
                    onVote={handleVote}
                    onToggleFavorite={handleToggleFavorite}
                    onDownload={handleDownload}
                  />
                );
              })
            ) : (
              <div className={styles.noResults}>
                {showPending
                  ? "No hay solicitudes pendientes de revisión."
                  : "Ups... No se encontraron resultados..."}
              </div>
            )}
          </div>
        )}
      </main>
    </NavBar>
  );
}
