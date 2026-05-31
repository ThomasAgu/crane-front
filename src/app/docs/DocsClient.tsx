// src/app/documentacion/DocsClient.tsx
"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { DocSection } from "./docsRegistry";

export default function DocsClient({ sections }: { sections: DocSection[] }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Ajuste de scroll-margin-top dinámico si es necesario
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(id);
    }
  };

  // Detecta en qué sección está el usuario al hacer scroll para iluminar el menú
  useEffect(() => {
    const observers = sections.map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        { rootMargin: "-20% 0px -60% 0px" } // Detecta la sección activa en el centro de la pantalla
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => obs?.observer.unobserve(obs.el));
    };
  }, [sections]);

  return (
    <main className="flex min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-100">
      
      {/* SIDEBAR NAVEGACIÓN */}
      <aside className="w-64 bg-white border-r border-slate-200/80 fixed top-0 bottom-0 left-16 overflow-y-auto p-6 hidden md:flex flex-col gap-6 z-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Documentación
          </h2>
          <nav className="flex flex-col gap-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`text-base ${isActive ? "opacity-100" : "opacity-70"}`}>
                    {section.icon}
                  </span>
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 md:ml-64 p-8 lg:p-12 xl:p-16 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl space-y-16">
          {sections.map((section) => (
            <article 
              key={section.id} 
              id={section.id}
              className="scroll-mt-24 border-b border-slate-100 pb-16 last:border-0"
            >
              {/* Encabezado formal de la Sección */}
              <div className="flex items-center gap-3 text-slate-400 text-xs font-bold tracking-wider uppercase mb-6">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </div>

              {/* Renderizador Markdown con Estilos de Alta Calidad */}
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-10 mb-4 border-b border-slate-100 pb-2" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3" {...props} />,
                  p: ({ ...props }) => <p className="text-base text-slate-600 leading-7 my-4" {...props} />,
                  ul: ({ ...props }) => <ul className="list-none my-4 space-y-2 text-slate-600" {...props} />,
                  li: ({ ...props }) => (
                    <li className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-500" {...props} />
                  ),
                  strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                  hr: () => <hr className="my-8 border-slate-200/60" />,
                  code: ({ ...props }) => (
                    <code className="bg-slate-100 text-slate-800 font-mono text-sm px-1.5 py-0.5 rounded border border-slate-200" {...props} />
                  ),
                  pre: ({ ...props }) => (
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-sm my-4" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <span className="block my-8 text-center">
                      <img 
                        className="rounded-xl border border-slate-200/80 shadow-md max-w-full h-auto mx-auto bg-white p-1" 
                        loading="lazy" 
                        {...props} 
                      />
                      {props.alt && (
                        <span className="block text-xs text-slate-400 mt-3 italic font-normal">
                          {props.alt}
                        </span>
                      )}
                    </span>
                  ),
                  
                }}
              >
                {section.content}
              </ReactMarkdown>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}