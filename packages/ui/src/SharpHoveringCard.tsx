import { ReactNode } from "react";

const SharpHoveringCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className} + border-2 shadow-[5px_5px_0px_0px_#000000]`}>
      {children}
    </div>
  );
};

export default SharpHoveringCard;
