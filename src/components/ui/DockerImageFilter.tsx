import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import styles from './DockerImageFilter.module.css';

interface DockerImageFilterProps {
  allImages: string[]; 
  selectedImages: string[]; 
  onSelectionChange: (selected: string[]) => void;
  onClose: () => void; 
}

const DockerImageFilter: React.FC<DockerImageFilterProps> = ({
  allImages,
  selectedImages,
  onSelectionChange,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = (image: string) => {
    const isSelected = selectedImages.includes(image);
    const newSelection = isSelected
      ? selectedImages.filter(i => i !== image)
      : [...selectedImages, image];
    
    onSelectionChange(newSelection);
  };

  // Filtramos la lista según lo que escriba el usuario
  const filteredImages = allImages.filter(image =>
    image.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.dockerFilterDropdown}>
      {/* Header del Dropdown */}
      <div className={styles.dropdownHeader}>
        <h5 className={styles.filterTitle}>Imágenes de Docker</h5>
        <button onClick={onClose} className={styles.iconCloseButton} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      {/* Buscador interno interactivo */}
      <div className={styles.searchBoxContainer}>
        <Search size={14} className={styles.searchInlineIcon} />
        <input 
          type="text" 
          placeholder="Buscar imagen..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.miniSearchInput}
        />
      </div>

      {/* Lista de Checkboxes con scroll refinado */}
      <div className={styles.checkboxList}>
        {filteredImages.length > 0 ? (
          filteredImages.map(image => {
            const isChecked = selectedImages.includes(image);
            return (
              <label 
                key={image} 
                className={`${styles.checkboxLabel} ${isChecked ? styles.labelChecked : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(image)}
                  className={styles.checkboxInput}
                />
                <span className={styles.imageName}>{image}</span>
              </label>
            );
          })
        ) : (
          <div className={styles.noImagesFound}>No se encontraron imágenes</div>
        )}
      </div>

      {/* Acciones inferiores */}
      <div className={styles.filterActions}>
        <button 
          onClick={() => onSelectionChange([])} 
          className={styles.clearButton} 
          disabled={selectedImages.length === 0}
        >
          Limpiar {selectedImages.length > 0 && `(${selectedImages.length})`}
        </button>
        <button onClick={onClose} className={styles.applyButton}>
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default DockerImageFilter;