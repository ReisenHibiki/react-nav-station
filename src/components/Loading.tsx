type LoadingProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

export default function Loading({
  text = "Loading...",
  size = "md",
}: LoadingProps) {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div
        className={`${sizeClass[size]} animate-spin rounded-full border-gray-300 border-t-blue-500`}
      />
      {text && (
        <span className="text-sm text-gray-500">{text}</span>
      )}
    </div>
  );
}