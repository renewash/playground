import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StandardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-0 flex min-h-screen min-w-screen flex-col">
      <Header />
      <main className="my-3 w-full flex-1">
        <div className="m-auto w-5/6">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default StandardLayout;
