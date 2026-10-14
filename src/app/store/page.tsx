"use client";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import AppItem from "./StoreItem";
import type { FilterType } from "@/lib/helper/FilterType";
import DockerImageFilter from "@/components/ui/DockerImageFilter";
import styles from "./store.module.css";
import Loader from "@/components/ui/Loader";
import {
  ArrowLeft,
  Clock3,
  Download,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import type { onHoldRepositoryDto, RepositoryDto } from "@/lib/dto/RepositoryDto";
import { useStore } from "@/hooks/useStore";
import { RequirePermission } from "@/components/layout/RequirePermission";
import { PendingItem } from "./PendingItem";
import { AlertSnackbar, useAlert } from "@/components/ui/AlertSnackbar";

const FilterBar: React.FC<{
  currentFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  onDockerFilterClick: () => void;
  isDockerFilterActive: boolean;
  isDockerFilterOpen: boolean;
  activeFilterCount: number;
  isShowPending: boolean;
}> = ({
  currentFilter,
  onFilterChange,
  onDockerFilterClick,
  isDockerFilterActive,
  isDockerFilterOpen,
  activeFilterCount,
  isShowPending,
}) => {
  const filters: { label: string; value: FilterType; icon: React.ReactNode }[] = [
    { label: "Mejor valoradas", value: "best_rated", icon: <Star size={15} /> },
    { label: "Favoritos", value: "favourites", icon: <Heart size={15} /> },
    { label: "Más descargadas", value: "downloads", icon: <Download size={15} /> },
  ];
  if (isShowPending) return null;

  return (
    <div className={styles.filterBar} role="group" aria-label="Ordenar repositorios">
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={currentFilter === filter.value ? styles.activeFilter : ""}
          aria-pressed={currentFilter === filter.value}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onDockerFilterClick}
        className={`${styles.dockerImagesButton} ${isDockerFilterActive ? styles.activeDockerFilter : ""}`}
        aria-pressed={isDockerFilterActive}
        aria-expanded={isDockerFilterOpen}
      >
        <SlidersHorizontal size={15} />
        Imágenes
        {activeFilterCount > 0 && (
          <span className={styles.filterCount}>{activeFilterCount}</span>
        )}
      </button>
    </div>
  );
};

export default function Store() {
  const {
    allDockerImages,
    displayedItems,
    filterType,
    handleApprove,
    handleDownload,
    handleDeleteRepository,
    handleReject: rejectRepository,
    handleToggleFavorite,
    handleViewDetails,
    handleVote,
    isDockerFilterOpen,
    loading,
    pendingCount,
    searchTerm,
    selectedDockerImages,
    setFilterType,
    setIsDockerFilterOpen,
    setSearchTerm,
    setSelectedDockerImages,
    setShowPending,
    showPending,
  } = useStore();
  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const handleReject = async (repositoryId: number, message: string) => {
    await rejectRepository(repositoryId, message);
    showAlert("El repositorio fue rechazado.", "success", "Rechazo enviado");
  };

  const handleDelete = async (repositoryId: number) => {
    try {
      await handleDeleteRepository(repositoryId);
      showAlert("El repositorio fue eliminado correctamente.", "success", "Repositorio eliminado");
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "No se pudo eliminar el repositorio.",
        "error",
        "Error al eliminar"
      );
    }
  };

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <header className={styles.storeHeader}>
          <div>
            <p className={styles.storeEyebrow}>CRANE · COMUNIDAD</p>
            <h1 className={styles.storeTitle}>Repositorio</h1>
            <p className={styles.storeDescription}>
              Descubre y comparte aplicaciones y plantillas listas para usar.
            </p>
          </div>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon} aria-hidden="true">
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="Buscar aplicación por nombre..."
              aria-label="Buscar aplicación por nombre"
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
              isDockerFilterOpen={isDockerFilterOpen}
              activeFilterCount={selectedDockerImages.length}
              isShowPending={showPending}
            />

            {!showPending && isDockerFilterOpen && (
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
              type="button"
              className={styles.pendingFilter}
              onClick={() => setShowPending((prev) => !prev)}
              aria-pressed={showPending}
            >
              {showPending ? <ArrowLeft size={16} /> : <Clock3 size={16} />}
              {showPending ? "Volver al repositorio" : "Pendientes"}
              {pendingCount > 0 && !showPending && (
                <span className={styles.pendingCount}>
                  {pendingCount}
                </span>
              )}
            </button>
          </RequirePermission>
        </div>

        <hr className={styles.divider} />
        {loading ? (
          <div className="mt-6 m-auto flex items-center justify-center">
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
                      onViewDetails={handleViewDetails}
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
                    onViewDetails={handleViewDetails}
                    onDelete={handleDelete}
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
        <AlertSnackbar
          alertState={alertState}
          handleCloseAlert={handleCloseAlert}
          global
        />
      </main>
    </NavBar>
  );
}
