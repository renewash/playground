import { useMemo, type ReactNode } from "react";
import { KonvaContext } from "./context";

import { createDrawingEngine } from "../../core/engine";

export const KonvaProvider = ({ children }: { children: ReactNode }) => {
  const engine = useMemo(() => createDrawingEngine(), []);
  return <KonvaContext value={engine}>{children}</KonvaContext>;
};
