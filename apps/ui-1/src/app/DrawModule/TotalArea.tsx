import { useScene, useInProgressObject } from "@repo/drawable/react";

const TotalArea = ({ engine }) => {
  const state = useScene(engine);
  const inProgressObject = useInProgressObject(engine);

  const area =
    inProgressObject && "area" in inProgressObject ? inProgressObject.area : 0;

  const totalArea =
    Object.entries(state.objects).reduce(
      (acc, [, obj]) => acc + ("area" in obj ? obj.area : 0),
      0,
    ) + area;

  return <div>Total Area = {totalArea}</div>;
};

export default TotalArea;
