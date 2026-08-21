// src/app/documentacion/page.tsx
import NavBar from "../../components/layout/NavBar";
import DocsClient from "./DocsClient";
import { getDocsSections } from "./docsRegistry";

export default function DocumentationPage() {
  const sections = getDocsSections();

  return (
    <NavBar>
      <DocsClient sections={sections} />
    </NavBar>
  );
}