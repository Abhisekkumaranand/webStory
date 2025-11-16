import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

export default function StoryCard({ story, to, onOpen, className = "" }) {
  const thumb =
    story?.slides && story.slides.length > 0
      ? story.slides[0].thumbnail ||
        (story.slides[0].resource_type === "video"
          ? story.slides[0].url.replace('/upload/', '/upload/so_0/')
          : story.slides[0].url)
      : null;

  const title = story?.title || "Untitled";
  const category = story?.category || "General";
  const createdAt = story?.createdAt ? new Date(story.createdAt) : null;
  const slideCount = story?.slides?.length ?? 0;

  const content = (
    <Card
      className={`group relative overflow-hidden border-0 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      aria-labelledby={`story-title-${story?._id}`}
    >
      <CardContent className="p-0">
        <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          {thumb ? (
            <img
              src={thumb}
              alt={`${title} thumbnail`}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
              <svg
                className="w-12 h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 11l2 2 3-3 5 5"
                />
              </svg>
            </div>
          )}

          {/* Play overlay */}
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="bg-white/90 rounded-full p-2 sm:p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-gray-800"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M5 3.868v16.264A1 1 0 0 0 6.52 21.5l12.96-8.132a1 1 0 0 0 0-1.736L6.52 2.5A1 1 0 0 0 5 3.868z" />
              </svg>
            </div>
          </div>

          {/* Slide count */}
           <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 text-white text-xs rounded-full px-2 py-1 flex items-center gap-1.5 backdrop-blur-sm">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M5 3.868v16.264A1 1 0 0 0 6.52 21.5l12.96-8.132a1 1 0 0 0 0-1.736L6.52 2.5A1 1 0 0 0 5 3.868z" />
            </svg>
            <span>{slideCount}</span>
          </div>
        </div>

      {/* Content */}
       <div className="p-2 sm:p-3 md:p-4">
        <h3
          id={`story-title-${story?._id}`}
          className="text-base sm:text-lg md:text-xl font-bold leading-tight text-gray-900 truncate mb-2"
        >
          {title}
        </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                {category}
              </span>
              {createdAt && (
                <time
                  dateTime={createdAt.toISOString()}
                  className="text-xs text-gray-500"
                >
                  {createdAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {slideCount} {slideCount === 1 ? "slide" : "slides"}
            </div>
          </div>
        </div>

        {/* Click overlay for accessibility */}
        {(to || onOpen) && (
          <button
            onClick={onOpen}
            className="absolute inset-0 aria-hidden"
            aria-hidden="true"
            tabIndex={-1}
            type="button"
          />
        )}
      </CardContent>
    </Card>
  );

  if (to) {
    // use Link if `to` provided
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  if (onOpen) {
    return (
      <div
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen();
        }}
        className="block"
      >
        {content}
      </div>
    );
  }

  return content;
}
