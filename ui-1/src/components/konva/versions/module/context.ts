import { createContext, useContext } from "react";
import {
  type DrawingStore,
  type DrawingState,
} from "@/components/konva/module/types";

type Engine = {
  store: DrawingStore;
  drawingState: DrawingState;
};

export const KonvaContext = createContext<Engine | null>(null);
export const useKonvaContext = () => {
  const ctx = useContext(KonvaContext);
  if (!ctx) throw new Error("Context needs to be used in provider");
  return ctx;
};
