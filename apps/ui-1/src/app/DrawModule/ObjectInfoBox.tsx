import type { DrawingEngine, DrawableObject } from "@repo/drawable";

const ObjectInfoBox = ({
  drawableObject,
  engine,
  index = "",
  className = "",
  ...rest
}: {
  drawableObject: DrawableObject;
  engine: DrawingEngine;
  index?: string;
  className?: string;
  [key: string]: any;
}) => {
  const area =
    drawableObject && "area" in drawableObject ? drawableObject.area : 0;

  const length =
    drawableObject && "length" in drawableObject ? drawableObject.length : 0;

  if (!drawableObject) return null;

  let measurementText = "NA";

  if (area) {
    measurementText = `${area} (Area)`;
  } else if (length) {
    measurementText = `${length} (Length)`;
  }

  return (
    <div className={` ${className}`} {...rest}>
      <div className="flex justify-between border-b-2 font-semibold capitalize">
        <span>
          {index} {drawableObject.type}
        </span>
        <button
          onClick={() => engine.deleteObjectById(drawableObject.id)}
          className="cursor-pointer hover:underline"
        >
          Delete
        </button>
      </div>
      <p>ID: {drawableObject.id}</p>
      <p>Measurements: {measurementText}</p>
    </div>
  );
};

export default ObjectInfoBox;
