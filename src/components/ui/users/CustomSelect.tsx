import { useEffect, useRef, useState } from "react";
import styles from "./CustomSelect.module.css";

export type CustomSelectOption<T extends string | number> = {
  value: T;
  label: string;
};

interface CustomSelectProps<T extends string | number> {
  options: CustomSelectOption<T>[];
  value?: T | "";
  onChange: (value: T) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}

export const CustomSelect = <T extends string | number>({
  options,
  value = "",
  onChange,
  placeholder = "Selecciona una opción",
  emptyText = "No hay opciones disponibles",
  disabled = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  optionClassName = "",
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (!isOpen || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const menuHeight = Math.min(220, options.length * 42 + 12);
      const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

      setMenuStyle({
        position: "fixed",
        top: openUp ? `${rect.top - menuHeight - 6}px` : `${rect.bottom + 6}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        maxHeight: `${menuHeight}px`,
        overflowY: "auto",
        zIndex: 2147483647,
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const menuHeight = Math.min(220, options.length * 42 + 12);
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

    setMenuStyle({
      position: "fixed",
      top: openUp ? `${rect.top - menuHeight - 6}px` : `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${menuHeight}px`,
      overflowY: "auto",
      zIndex: 2147483647,
    });
  }, [isOpen, value, options.length]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={wrapperRef} className={`${styles.customSelectWrapper} ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.selectTrigger} ${triggerClassName}`.trim()}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`.trim()}>▾</span>
      </button>

      {isOpen && (
        <ul
          className={`${styles.optionsList} ${menuClassName}`.trim()}
          style={menuStyle}
          role="listbox"
        >
          {options.length === 0 ? (
            <li className={styles.emptyOption}>{emptyText}</li>
          ) : (
            options.map((option) => (
              <li
                key={String(option.value)}
                className={`${styles.optionItem} ${option.value === value ? styles.optionItemSelected : ""} ${optionClassName}`.trim()}
              >
                <button
                  type="button"
                  className={styles.optionButton}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
