import { Stage, Layer, Line } from "react-konva";

const Tld = () => {
  const width = 800;
  const height = 800;
  const points = [50, 70, 140, 23, 250, 120, 300, 300, 400, 400];
  return (
    <div className="flex">
      <div className="border">
        {/* <Stage width={width} height={height}>
          <Layer>
            <Line
              points={points}
              stroke="red"
              strokeWidth={15}
              lineCap="round"
              lineJoin="round"
            />
            <Line
              points={points}
              stroke="green"
              strokeWidth={2}
              lineJoin="round"
              dash={[33, 10]}
              y={-100}
              x={100}
            />
          </Layer>
        </Stage> */}
        <Stage width={width} height={height}>
          <Layer scale={{ x: width, y: height }}>
            <Line
              points={[0.5, 0.5, 0.4, 0.9, 0.25, 0.6, 0.3, 0.2]}
              stroke="red"
              strokeWidth={2 / width}
              // strokeScaleEnabled={false}
              lineCap="round"
              lineJoin="round"
            />

            <Line
              points={[0.5, 0.5, 0.4, 0.9, 0.25, 0.6, 0.3, 0.2]}
              stroke="green"
              strokeWidth={2 / width}
              // strokeScaleEnabled={false}
              lineJoin="round"
              dash={[0.05, 0.02]} // normalized dash
              y={0.1} // normalized offset instead of 50px
              x={0.1} // normalized offset instead of 50px
            />
          </Layer>
        </Stage>
      </div>
      <div className="border">gd</div>
    </div>
  );
};

export default Tld;
