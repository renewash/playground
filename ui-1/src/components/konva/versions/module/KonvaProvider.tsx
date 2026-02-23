import { type ReactNode } from "react";
import { KonvaContext } from "./context";

import { useDrawingStore } from "@/components/konva/module";

export const KonvaProvider = ({ children }: { children: ReactNode }) => {
  const engine = useDrawingStore();
  return <KonvaContext value={engine}>{children}</KonvaContext>;
};
