import React, { useState, useEffect } from "react";
import { searchDockerImages } from "@/src/app/services/DockerHubService";

export default function DockerImageSelector({ 
  value, 
  onChange,
  onPickImage
}: { 
  value: string; 
  onChange: (v: string) => void; 
  onPickImage?: (v: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
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

  return (
    <div className="relative mb-3">
      <label className="block text-sm font-medium mb-1">Imagen</label>
      <input
        className="w-full border p-2 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar imagen en Docker Hub"
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
          {results.map((img) => (
            <li
              key={img.name}
              onClick={() => {
                onChange(img.name);
                setQuery(img.name);
                setIsOpen(false);
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