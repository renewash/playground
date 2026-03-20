import { useScene, useInProgressObject } from "@repo/drawable/react";
import SharpBorder from "@/components/SharpBorder";
import { DrawingEngine } from "@repo/drawable";

const TotalArea = ({ engine }: { engine: DrawingEngine }) => {
  const state = useScene(engine);
  const inProgressObject = useInProgressObject(engine);

  const area =
    inProgressObject && "area" in inProgressObject ? inProgressObject.area : 0;

  const totalArea =
    Object.entries(state.objects).reduce(
      (acc, [, obj]) => acc + ("area" in obj ? obj.area : 0),
      0,
    ) + area;

  return (
    <div className="flex gap-3">
      <SharpBorder className="mt-3 w-1/3 p-2">
        <div className="text-md flex flex-col items-center bg-yellow-200 p-3">
          <p className="font-bold">Total Area</p>
          <p className="">{Math.round(totalArea * 1000000) / 1000000}</p>
        </div>
        <div className="w-1/3 border-b-2 py-2" />
      </SharpBorder>
    </div>
  );
};

export default TotalArea;
