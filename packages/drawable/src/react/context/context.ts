import { createContext, useContext } from "react";
import { type DrawingEngine } from "../../core/types";

export const KonvaContext = createContext<DrawingEngine | null>(null);
export const useKonvaContext = () => {
  const ctx = useContext(KonvaContext);
  if (!ctx) throw new Error("Context needs to be used in provider");
  return ctx;
};
