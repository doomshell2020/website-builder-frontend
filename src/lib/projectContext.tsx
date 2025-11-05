"use client";
import { createContext, useContext } from "react";

const ProjectContext = createContext<any>(null);

export function ProjectProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  return useContext(ProjectContext);
}
