import useDrawingStore from "@/components/konva/drawingStore";

const KonvaControls = () => {
  const clearDraft = useDrawingStore((s) => s.clearDraft);
  const applyDraft = useDrawingStore((s) => s.applyDraft);
  const reset = useDrawingStore((s) => s.reset);

  return (
    <div className="flex h-12 flex-row gap-3">
      <button
        className="cursor-pointer rounded-md border px-3 py-1.5 hover:bg-amber-500"
        onClick={clearDraft}
      >
        clear
      </button>
      <button
        className="cursor-pointer rounded-md border px-3 py-1.5 hover:bg-green-500"
        onClick={applyDraft}
      >
        apply
      </button>
      <button
        className="cursor-pointer rounded-md border px-3 py-1.5 hover:bg-blue-500"
        onClick={reset}
      >
        reset
      </button>
    </div>
  );
};

export default KonvaControls;
