// components/downloads/pdf-gesture-handle.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PDFGestureHandleProps {
  direction: "left" | "right";
  onClick: () => void;
}

export function PDFGestureHandle({ direction, onClick }: PDFGestureHandleProps) {
  return (
    <button
      aria-label={direction === "left" ? "Previous page" : "Next page"}
      onClick={onClick}
      className={`
        absolute top-1/2 z-40
        ${direction === "left" ? "left-2 -translate-y-1/2" : "right-2 -translate-y-1/2"}
        bg-black/30 hover:bg-black/50 rounded-full p-2
        flex items-center justify-center
        transition
        sm:hidden
      `}
      style={{ touchAction: "manipulation" }}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-6 w-6 text-white" />
      ) : (
        <ChevronRight className="h-6 w-6 text-white" />
      )}
    </button>
  );
}