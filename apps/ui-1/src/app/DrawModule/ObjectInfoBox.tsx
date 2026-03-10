const ObjectInfoBox = ({
  drawableObject,
  engine,
  index = "",
  className = "",
  ...rest
}) => {
  const area =
    drawableObject && "area" in drawableObject ? drawableObject.area : 0;

  const length =
    drawableObject && "length" in drawableObject ? drawableObject.length : 0;

  if (!drawableObject) return null;

  return (
    <div className={` ${className}`} {...rest}>
      <div className="flex justify-between border-b-2 font-semibold capitalize">
        <span>
          {index} {drawableObject.type}
        </span>
        <button
          onClick={() => engine.deleteObject(drawableObject.id)}
          className="cursor-pointer hover:underline"
        >
          Delete
        </button>
      </div>
      <p>ID: {drawableObject.id}</p>
      <p>Measurements: {area || length || "NA"}</p>
    </div>
  );
};

export default ObjectInfoBox;
