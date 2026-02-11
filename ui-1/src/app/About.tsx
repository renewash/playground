const About = () => {
  const width = 400;
  const height = 400;
  return (
    <div className="relative rounded border border-green-500 px-2">
      <div>About Page</div>
      <div
        className="top-0 left-0 w-full overflow-auto border-4 border-amber-700"
        style={{ width, height }}
      >
        asd
        <img
          className="absolute"
          src={`https://picsum.photos/${width}/${height}`}
          draggable={false}
        />
        <img
          className="absolute"
          src={`https://picsum.photos/${width}/${height}`}
          draggable={false}
        />
      </div>
    </div>
  );
};
export default About;
