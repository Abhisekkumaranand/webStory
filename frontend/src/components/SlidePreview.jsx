import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ANIMATIONS = [
  { value: "", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-right", label: "Slide Right" },
  { value: "zoom", label: "Zoom" },
];

export default function SlidePreview({
  idx,
  slideMeta = {},
  onMetaChange,
  onFileChange,
  onRemove,
}) {
  const [playingPreview, setPlayingPreview] = useState(false);
  const fileInputRef = useRef(null);

  // compute preview URL (prefer File object)
  const previewUrl = useMemo(() => {
    if (slideMeta?.file) return URL.createObjectURL(slideMeta.file);
    if (slideMeta?.url) return slideMeta.url;
    return null;
  }, [slideMeta?.file, slideMeta?.url]);

  // cleanup object URL when file changes/unmount
  useEffect(() => {
    let obj = null;
    if (slideMeta?.file) {
      obj = URL.createObjectURL(slideMeta.file);
      return () => {
        try {
          URL.revokeObjectURL(obj);
        } catch {}
      };
    }
    return undefined;
  }, [slideMeta?.file]);

  const safeUpdate = (patch) => {
    try {
      onMetaChange?.(idx, { ...slideMeta, ...patch });
    } catch (err) {
      console.error("onMetaChange error", err);
    }
  };

  const handleFile = (e) => {
    try {
      const f = e.target.files?.[0] ?? null;
      if (f) onFileChange?.(idx, f);
    } catch (err) {
      console.error("onFileChange error", err);
    }
  };

  const triggerPreview = () => {
    setPlayingPreview(false);
    requestAnimationFrame(() => setPlayingPreview(true));
    const dur = slideMeta?.duration ?? 5000;
    setTimeout(() => setPlayingPreview(false), Math.max(1000, dur));
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-4 md:flex md:items-start md:gap-6">
      {/* preview column */}
      <div className="md:w-64 w-full h-36 md:h-44 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden flex items-center justify-center relative shadow-inner">
        {!previewUrl ? (
          <div className="text-sm text-gray-500 text-center px-3">
            No media selected
          </div>
        ) : slideMeta?.type === "video" ? (
          <video
            key={previewUrl}
            src={previewUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : (
          <img
            key={previewUrl + (playingPreview ? "-play" : "-idle")}
            src={previewUrl}
            alt={`slide-${idx}`}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              playingPreview ? `animate-${slideMeta?.animation || "none"}` : ""
            }`}
            style={{
              transform:
                playingPreview && slideMeta?.animation === "zoom"
                  ? "scale(1.06)"
                  : undefined,
            }}
          />
        )}

        {/* overlay controls */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            Change
          </Button>
          <Button size="sm" onClick={triggerPreview}>
            Preview
          </Button>
        </div>
      </div>

      {/* details / controls */}
      <div className="mt-3 md:mt-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="min-w-[70px]">Type</Label>
            <select
              value={slideMeta?.type || "image"}
              onChange={(e) => safeUpdate({ type: e.target.value })}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Label className="min-w-[110px]">Duration (ms)</Label>
            <Input
              type="number"
              value={slideMeta?.duration ?? 5000}
              onChange={(e) =>
                safeUpdate({ duration: Number(e.target.value || 0) })
              }
              className="w-full sm:w-32"
              min={500}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Label className="min-w-[70px]">Animation</Label>
          <select
            value={slideMeta?.animation || ""}
            onChange={(e) => safeUpdate({ animation: e.target.value })}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {ANIMATIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 ml-2">
            Preview shows the chosen animation.
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="text-sm text-gray-600">
            <span className="font-medium">Selected:</span>{" "}
            <span className="break-all">
              {slideMeta?.file?.name ?? slideMeta?.url
                ? getFilenameFromUrl(slideMeta?.url)
                : "—"}
            </span>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove?.(idx)}
            >
              Remove
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          Tip: On mobile, controls are stacked below the preview. Use the{" "}
          <span className="font-medium">Preview</span> button to see animations.
        </div>
      </div>

      {/* scoped keyframes for animations (lightweight) */}
      <style>{`
        .animate-fade { animation: fade-in 700ms ease-out both; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .animate-slide-left { animation: slide-left 700ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes slide-left { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }

        .animate-slide-right { animation: slide-right 700ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }

        .animate-zoom { animation: zoom-in 6s ease-out both; }
        @keyframes zoom-in { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
      </CardContent>
    </Card>
  );
}

SlidePreview.propTypes = {
  idx: PropTypes.number.isRequired,
  slideMeta: PropTypes.shape({
    file: PropTypes.any,
    type: PropTypes.oneOf(["image", "video"]),
    duration: PropTypes.number,
    animation: PropTypes.string,
    url: PropTypes.string,
  }),
  onMetaChange: PropTypes.func,
  onFileChange: PropTypes.func,
  onRemove: PropTypes.func,
};

/* helper */
function getFilenameFromUrl(url) {
  try {
    if (!url) return "";
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split("/").pop() || url);
  } catch {
    return url || "";
  }
}
