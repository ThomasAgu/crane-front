import React from 'react';
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
  const handleToggle = (image: string) => {
    let newSelection: string[];
    
    if (selectedImages.includes(image)) {
      newSelection = selectedImages.filter(i => i !== image);
    } else {
      newSelection = [...selectedImages, image];
    }
    
    onSelectionChange(newSelection);
  };
  
  return (
    <div className={styles.dockerFilterDropdown}>
      <h5 className={styles.filterTitle}>Filtrar por Imágenes de Docker</h5>
      <div className={styles.checkboxList}>
        {allImages.map(image => (
          <label key={image} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedImages.includes(image)}
              onChange={() => handleToggle(image)}
              className={styles.checkboxInput}
            />
            {image}
          </label>
        ))}
      </div>
      <div className={styles.filterActions}>
          <button onClick={onClose} className={styles.closeButton}>
              Cerrar
          </button>
          <button 
              onClick={() => onSelectionChange([])} 
              className={styles.clearButton} 
              disabled={selectedImages.length === 0}
          >
              Limpiar ({selectedImages.length})
          </button>
      </div>
    </div>
  );
};

export default DockerImageFilter;