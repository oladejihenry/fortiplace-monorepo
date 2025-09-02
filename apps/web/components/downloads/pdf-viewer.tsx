// components/downloads/pdf-viewer.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useGesture } from '@use-gesture/react';
import { PDFFooter } from './pdf-footer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PDFGestureHandle } from './pdf-gesture-handle';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDoublePage, setIsDoublePage] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesWrapperRef = useRef<HTMLDivElement>(null);

  // Responsive width
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fullscreen effect and event
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Ensure body classes are in sync with fullscreen state
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('overflow-hidden', 'bg-black');
    } else {
      document.body.classList.remove('overflow-hidden', 'bg-black');
    }
  }, [isFullscreen]);

  // Gesture handlers
  useGesture(
    {
      onDrag: ({ swipe: [swipeX] }) => {
        if (swipeX === -1 && pageNumber < numPages) setPageNumber(p => isDoublePage ? Math.min(p + 2, numPages) : p + 1);
        if (swipeX === 1 && pageNumber > 1) setPageNumber(p => isDoublePage ? Math.max(p - 2, 1) : p - 1);
      },
    },
    { target: containerRef }
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    setError(error.message);
  }

  // Toggle fullscreen on button click
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) containerRef.current.requestFullscreen();
    } else {
      if (document.fullscreenElement) document.exitFullscreen();
    }
  }, [isFullscreen]);

  // Footer actions
  const nextPage = useCallback(() => {
    if (isDoublePage) setPageNumber(p => Math.min(p + 2, numPages));
    else if (pageNumber < numPages) setPageNumber(p => p + 1);
  }, [pageNumber, numPages, isDoublePage]);
  const prevPage = useCallback(() => {
    if (isDoublePage) setPageNumber(p => Math.max(p - 2, 1));
    else if (pageNumber > 1) setPageNumber(p => p - 1);
  }, [pageNumber, isDoublePage]);
  const zoomIn = useCallback(() => setScale(s => Math.min(s + 0.1, 2)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(s - 0.1, 0.3)), []);
  const togglePageMode = useCallback(() => setIsDoublePage(v => !v), []);

  // Go to first and last page handlers
  const goToFirstPage = useCallback(() => setPageNumber(1), []);
  const goToLastPage = useCallback(() => {
    if (isDoublePage) {
      // If numPages is even, last double page starts at numPages-1, else at numPages
      setPageNumber(numPages % 2 === 0 ? numPages - 1 : numPages);
    } else {
      setPageNumber(numPages);
    }
  }, [numPages, isDoublePage]);

  // Calculate page width for responsiveness
  // For double page, each page should fit within the container, and allow horizontal scroll if needed
  let pageWidth = Math.floor((containerWidth - (isDoublePage ? 64 : 32)) / (isDoublePage ? 2 : 1));
  if (pageWidth > 900) pageWidth = 900;
  if (pageWidth < 200) pageWidth = 200; // minimum width for usability

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 px-4 bg-black">
        <p className="text-center">Failed to load PDF. Please try again later.</p>
      </div>
    );
  }

  // Swipe indicator for mobile
  const showSwipeHint = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          }
        >
          <div
            ref={pagesWrapperRef}
            className={`flex ${isDoublePage ? 'flex-row gap-4' : 'flex-col'} items-center justify-center py-8 w-auto min-w-0`}
            style={isDoublePage ? { minWidth: 0 } : undefined}
          >
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              width={pageWidth}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="bg-white rounded-lg shadow-2xl"
            />
            {isDoublePage && pageNumber < numPages && (
              <Page
                key={pageNumber + 1}
                pageNumber={pageNumber + 1}
                width={pageWidth}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white rounded-lg shadow-2xl"
              />
            )}
          </div>
        </Document>
      </div>
      {showSwipeHint && (
        <>
          <PDFGestureHandle direction="left" onClick={prevPage} />
          <PDFGestureHandle direction="right" onClick={nextPage} />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/80 text-xs pointer-events-none select-none">
            <span>Swipe or tap arrows to change page</span>
          </div>
        </>
      )}
      <PDFFooter
        onPrev={prevPage}
        onNext={nextPage}
        onFirst={goToFirstPage}
        onLast={goToLastPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFullscreen={toggleFullscreen}
        onTogglePageMode={togglePageMode}
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        isDoublePage={isDoublePage}
      />
    </div>
  );
}