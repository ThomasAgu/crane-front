"use client";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import AppItem from "./StoreItem";
import type { FilterType } from "@/lib/helper/FilterType";
import DockerImageFilter from "@/components/ui/DockerImageFilter";
import styles from "./store.module.css";
import Loader from "@/components/ui/Loader";
import { Search } from "lucide-react";
import type { onHoldRepositoryDto, RepositoryDto } from "@/lib/dto/RepositoryDto";
import { useStore } from "@/hooks/useStore";
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
  const {
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
