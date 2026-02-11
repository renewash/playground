import ComA from "@/app/Home/ComA";
import ComB from "@/app/Home/ComB";
import { CameraProvider } from "@/components/Camera";

const Home = () => {
  return (
    <CameraProvider>
      <div className="h-full rounded border border-gray-600 px-2">
        <ComA>
          <ComB />
        </ComA>
      </div>
    </CameraProvider>
  );
};
export default Home;
