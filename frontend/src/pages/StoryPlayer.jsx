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

  if (!story) return <div className="text-center p-6">Loading...</div>;
  const slide = story.slides[index];

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="p-4 flex justify-between items-center z-20">
        <div />
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => prev()}>
            Prev
          </Button>
          <Button variant="ghost" onClick={() => next()}>
            Next
          </Button>
          <Button onClick={() => nav("/")}>Close</Button>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onClick={(e) => {
          const x = e.clientX;
          if (x < window.innerWidth / 2) prev();
          else next();
        }}
      >
        {slide.type === "image" ? (
          <img src={slide.url} alt={slide.alt || `slide-${index}`} className="max-w-full max-h-full object-contain" />
        ) : (
          <video src={slide.url} className="max-w-full max-h-full" autoPlay onEnded={() => next()} controls />
        )}
      </div>

      <div className="p-2 z-20">
        <div className="w-full h-2 bg-white/20 rounded overflow-hidden">
          <div
            className="h-2 bg-white transition-all"
            style={{ width: `${((index + 1) / story.slides.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}