import React, { useEffect, useRef, useState } from "react";
import { fetchStory } from "../api/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StoryPlayer() {
  const { id } = useParams();
  const nav = useNavigate();
  const [story, setStory] = useState(null);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStory(id);
        setStory(data);
      } catch (err) {
        console.error(err);
      }
    })();

    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") nav("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id]);

  useEffect(() => {
    if (!story) return;
    clearTimeout(timeoutRef.current);
    const slide = story.slides[index];
    if (!slide) return;
    if (slide.type === "image") {
      const dur = slide.duration || 5000;
      timeoutRef.current = setTimeout(() => next(), dur);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [story, index]);

  const next = () => {
    if (!story) return;
    if (index < story.slides.length - 1) setIndex((i) => i + 1);
    else nav("/");
  };
  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Only handle horizontal swipes (ignore vertical scrolls)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        next(); // Swipe left = next
      } else {
        prev(); // Swipe right = previous
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!story) return <div className="text-center p-6">Loading...</div>;
  const slide = story.slides[index];

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="p-3 sm:p-4 flex justify-between items-center z-20">
        <div />
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => prev()}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-h-[44px] min-w-[44px]"
          >
            <span className="hidden sm:inline">Prev</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => next()}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-h-[44px] min-w-[44px]"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">→</span>
          </Button>
          <Button
            onClick={() => nav("/")}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-h-[44px]"
          >
            <span className="hidden sm:inline">Close</span>
            <span className="sm:hidden">✕</span>
          </Button>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onClick={(e) => {
          const x = e.clientX;
          if (x < window.innerWidth / 2) prev();
          else next();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slide.type === "image" ? (
          <img src={slide.url} alt={slide.alt || `slide-${index}`} className="max-w-full max-h-full object-contain" />
        ) : (
          <video
            src={slide.resource_type === "video" ? slide.url.replace('/upload/', '/upload/f_mp4/') : slide.url}
            className="max-w-full max-h-full"
            autoPlay
            onEnded={() => next()}
            controls
          />
        )}
      </div>

      <div className="p-2 sm:p-3 z-20">
        <div className="w-full h-3 sm:h-2 bg-white/20 rounded overflow-hidden">
          <div
            className="h-3 sm:h-2 bg-white transition-all"
            style={{ width: `${((index + 1) / story.slides.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}