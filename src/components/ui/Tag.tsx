import React from 'react';
import styles from './Tag.module.css'; 

interface TagProps {
  text: string;
  bgColor?: string;
  color?: string;
}

const Tag: React.FC<TagProps> = ({
  text,
  bgColor,
  color
}) => {
  const finalBgColor = bgColor || '#D4D4D4'; 
  const finalColor = color || '#171717'; 

  return (
    <div 
      className={styles.tag}
      style={{
        backgroundColor: finalBgColor, 
        color: finalColor, 
      }}
    >
      {text}
    </div>
  );
}

export default Tag;