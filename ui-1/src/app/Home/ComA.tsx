import type { ReactNode } from "react";

const ComA = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="m-2 rounded border border-gray-600 p-2">
      <div>Component A</div>
      {children}
    </div>
  );
};

export default ComA;
