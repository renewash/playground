import useDrawingStore from "./drawingStore";

const KonvaControls = () => {
  const { clearDraft, applyDraft } = useDrawingStore();

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
    </div>
  );
};

export default KonvaControls;
