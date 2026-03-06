const ObjectInfoBox = ({
  drawableObject,
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
      <p className="border-b-2 font-semibold capitalize">
        {index} {drawableObject.type}
      </p>
      <p>ID: {drawableObject.id}</p>
      <p>Measurements: {area || length || "NA"}</p>
    </div>
  );
};

export default ObjectInfoBox;
