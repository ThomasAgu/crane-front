import React, { useState, useEffect, useRef } from "react";
import { searchDockerImages } from "@/app/services/DockerHubService";

export default function DockerImageSelector({ 
  value, 
  onChange,
  onPickImage,
}: { 
  value: string; 
  onChange: (v: string) => void; 
  onPickImage?: (v: string) => void;
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current || !query) {
      setResults([]);
      if (!query) setIsOpen(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const images = await searchDockerImages(query);
      setResults(images);
      setLoading(false);
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (value || !hasInteracted.current) {
      setQuery(value || "");
      if (value) hasInteracted.current = false;
    }
  }, [value]);

  const handleInputChange = (nextValue: string) => {
    hasInteracted.current = true;
    setQuery(nextValue);
    onChange("");
  };

  return (
    <div className="relative mb-3">
      <label className="block text-sm font-medium mb-1">
        Imagen <span className="text-red-500">*</span>
      </label>
      <input
        data-editor-field="service-image"
        className={`w-full border p-2 rounded transition-colors ${
          !query ? "border-red-500 bg-red-50 focus:outline-red-500" : "border-gray-300"
        }`}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Buscar imagen en Docker Hub"
      />
      {!query && (
        <p className="text-xs text-red-500 mt-1">La imagen del contenedor es obligatoria.</p>
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
          {results.map((img) => (
            <li
              key={img.name}
              onClick={() => {
                setQuery(img.name);
                hasInteracted.current = false;
                setIsOpen(false);
                if (onPickImage) {
                  onPickImage(img.name);
                } else {
                  onChange(img.name);
                }
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-medium text-gray-700">{img.name}</div>
              {img.description && (
                <div className="text-xs text-gray-500 truncate">{img.description}</div>
              )}
              {img.official && <span className="text-xs text-blue-500">✔ Oficial</span>}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-xs text-gray-400 mt-1">Buscando...</p>}
    </div>
  );
}