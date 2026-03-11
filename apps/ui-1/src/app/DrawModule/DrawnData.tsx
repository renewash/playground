import { useScene } from "@repo/drawable/react";
import SharpBorder from "@/components/SharpBorder";
import ObjectInfoBox from "./ObjectInfoBox";
import { DrawingEngine } from "@repo/drawable";

const DrawnData = ({ engine }: { engine: DrawingEngine }) => {
  const state = useScene(engine);

  return (
    <SharpBorder className="mt-4 w-full px-2 py-4">
      {Object.entries(state.objects).map(([id, obj], index) => {
        return (
          <ObjectInfoBox
            key={id}
            engine={engine}
            index={`${index + 1}.`}
            className="bg-yellow-200 px-2 py-3"
            drawableObject={obj}
          />
        );
      })}
      <span>------------</span>
    </SharpBorder>
  );
};

export default DrawnData;
