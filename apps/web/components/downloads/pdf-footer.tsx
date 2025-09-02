// components/downloads/pdf-footer.tsx
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, FileText, Files, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PDFFooterProps {
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onTogglePageMode: () => void;
  pageNumber: number;
  numPages: number;
  scale: number;
  isDoublePage: boolean;
}

export function PDFFooter({
  onPrev, onNext, onFirst, onLast, onZoomIn, onZoomOut, onFullscreen, onTogglePageMode,
  pageNumber, numPages, scale, isDoublePage
}: PDFFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-background/90 border-t border-border flex items-center justify-center gap-2 py-2 z-50">
      <Button variant="ghost" size="icon" onClick={onFirst} disabled={pageNumber === 1} className="h-7 w-7">
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onPrev} disabled={pageNumber <= 1} className="h-7 w-7">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">{pageNumber}{isDoublePage && pageNumber < numPages ? `-${pageNumber + 1}` : ""} / {numPages}</span>
      <Button variant="ghost" size="icon" onClick={onNext} disabled={pageNumber >= numPages || (isDoublePage && pageNumber + 1 > numPages)} className="h-7 w-7">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onLast} disabled={pageNumber === numPages} className="h-7 w-7">
        <ChevronsRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-7 w-7"><ZoomOut className="h-4 w-4" /></Button>
      <span className="text-xs">{Math.round(scale * 100)}%</span>
      <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-7 w-7"><ZoomIn className="h-4 w-4" /></Button>
      <Button
        variant={isDoublePage ? "default" : "ghost"}
        size="icon"
        onClick={onTogglePageMode}
        title="Toggle single/double page"
        className="h-7 w-7"
      >
        {isDoublePage ? <Files className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onFullscreen} className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
    </footer>
  );
}