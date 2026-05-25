// src/app/documentacion/DocsClient.tsx
"use client";
import ReactMarkdown from "react-markdown";
import { DocSection } from "./docsRegistry";

export default function DocsClient({ sections }: { sections: DocSection[] }) {
  
  // Función para manejar el scroll suave al hacer clic en el menú
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <main className="flex min-h-screen text-slate-800 ms-16">
      
      {/* SIDEBAR: Ahora actúa como un menú de anclas (Navegación) */}
      <aside className="w-50 bg-white border-r border-gray-200 flex flex-col gap-2 sticky p-2">
        <h2 className="text-xl font-bold mb-4">Documentación</h2>
        <nav className="flex flex-col gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
            >
              <span>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO: Renderiza todas las secciones juntas una abajo de la otra */}
      <section className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
        {sections.map((section) => (
          <div 
            key={section.id} 
            id={section.id}
            className="scroll-mt-6"
          >
            {/* Opcional: Un banner o indicador visual del inicio de sección */}
            <div className="flex items-center gap-2 font-bold border-b pb-3 mb-6 mt-4 text-slate-700">
              <span>{section.icon}</span>
              <h2>{section.title}</h2>
            </div>

            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4 text-slate-800" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold my-3 text-slate-700 border-b pb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-medium my-2 text-slate-600 mt-4" {...props} />,
                p: ({ node, ...props }) => <p className="text-base text-gray-600 my-2 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside my-3 space-y-1 text-gray-600" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-slate-950" {...props} />,
              }}
              >
                {section.content}
              </ReactMarkdown>
          </div>
        ))}
      </section>

    </main>
  );
}