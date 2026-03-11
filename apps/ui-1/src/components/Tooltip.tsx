const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  return (
    // The parent container is set as a 'group' and 'relative'
    <div className="group relative flex justify-center">
      {/* The element that triggers the tooltip */}
      {children}

      {/* The tooltip content */}
      <div className="absolute bottom-full mb-2 hidden w-max rounded-md bg-gray-800 px-3 py-1 text-sm text-white opacity-50 shadow-lg transition-opacity duration-300 group-hover:block group-hover:opacity-100">
        {content}
        {/* Optional: Add a small arrow/triangle tip */}
        <div className="absolute top-full left-1/2 h-2 w-2 -translate-y-1/2 rotate-45 transform bg-gray-800"></div>
      </div>
    </div>
  );
};

export default Tooltip;
