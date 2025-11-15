import React, { useState, useEffect } from "react";
import { createStory } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StoryForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [slidesMeta, setSlidesMeta] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    return () => {
      slidesMeta.forEach((s) => {
        if (s.preview) URL.revokeObjectURL(s.preview);
      });
    };
  }, [slidesMeta]);

  const addSlideField = () =>
    setSlidesMeta((prev) => [
      ...prev,
      {
        file: null,
        preview: null,
        type: "image",
        duration: 5000,
        animation: "",
      },
    ]);

  const updateSlide = (i, key, value) =>
    setSlidesMeta((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: value };
      if (key === "file") {
        if (copy[i].preview) URL.revokeObjectURL(copy[i].preview);
        copy[i].preview = value ? URL.createObjectURL(value) : null;
      }
      return copy;
    });

  const removeSlide = (i) =>
    setSlidesMeta((prev) => {
      const slide = prev[i];
      if (slide?.preview) URL.revokeObjectURL(slide.preview);
      return prev.filter((_, idx) => idx !== i);
    });

  const moveSlide = (fromIndex, toIndex) =>
    setSlidesMeta((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (slidesMeta.length === 0) {
      setError("At least one slide is required");
      return;
    }
    const validSlides = slidesMeta.filter(s => s.file);
    if (validSlides.length === 0) {
      setError("At least one slide with a file is required");
      return;
    }

    setIsUploading(true);
    setError("");
    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);

    const slidesPayload = [];
    slidesMeta.forEach((s) => {
      if (s.file) {
        formData.append("slides", s.file);
        slidesPayload.push({
          type: s.type,
          duration: s.duration,
          animation: s.animation,
          fileIndex: slidesPayload.length,
        });
      }
    });
    formData.append("slides", JSON.stringify(slidesPayload));

    try {
      await createStory(formData, { signal: controller.signal });
      nav("/admin");
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Upload cancelled");
      } else {
        console.error(err);
        setError(
          "Create failed: " + (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setIsUploading(false);
      setAbortController(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
          <p className="mt-2 text-gray-600">
            Build an engaging story with multiple slides
          </p>
        </div>

        <Card className="shadow-lg  ">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl p-3 ">Story Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Story Title
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter a compelling title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Category
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="Sports">Sports</option>
                      <option value="Education">Education</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Slides
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add images or videos to create your story
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={addSlideField}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Slide
                  </Button>
                </div>

                <div className="space-y-4">
                  {slidesMeta.map((s, i) => (
                    <Card
                      key={i}
                      className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-700">
                                  Media File
                                </Label>
                                <div className="mt-1">
                                  {s.file ? (
                                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                                      <span className="text-sm text-gray-700 truncate">{s.file.name}</span>
                                      <Button
                                        type="button"
                                        onClick={() => updateSlide(i, "file", null)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-800 px-3 py-1"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) =>
                                          updateSlide(i, "file", e.target.files[0])
                                        }
                                        className="hidden"
                                        id={`file-${i}`}
                                      />
                                      <label
                                        htmlFor={`file-${i}`}
                                        className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                                      >
                                        <div className="text-center">
                                          <svg
                                            className="mx-auto h-8 w-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                          </svg>
                                          <p className="mt-1 text-sm text-gray-600">
                                            Click to upload
                                          </p>
                                        </div>
                                      </label>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="sm:w-32">
                                <Label className="text-sm font-medium text-gray-700">
                                  Type
                                </Label>
                                <select
                                  value={s.type}
                                  onChange={(e) =>
                                    updateSlide(i, "type", e.target.value)
                                  }
                                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="image">Image</option>
                                  <option value="video">Video</option>
                                </select>
                              </div>
                            </div>

                            {s.preview && (
                              <div className="mt-3">
                                <Label className="text-sm font-medium text-gray-700">
                                  Preview
                                </Label>
                                <div className="mt-1">
                                  {s.type === "image" ? (
                                    <img
                                      src={s.preview}
                                      alt="Preview"
                                      className="max-w-48 max-h-32 object-cover rounded-lg border"
                                    />
                                  ) : (
                                    <video
                                      src={s.preview}
                                      className="max-w-48 max-h-32 object-cover rounded-lg border"
                                      controls
                                    />
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">
                                  Duration (ms)
                                </Label>
                                <Input
                                  type="number"
                                  value={s.duration}
                                  onChange={(e) =>
                                    updateSlide(
                                      i,
                                      "duration",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="mt-1"
                                  placeholder="5000"
                                  min="1000"
                                  max="30000"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  Animation (optional)
                                </Label>
                                <Input
                                  value={s.animation}
                                  onChange={(e) =>
                                    updateSlide(i, "animation", e.target.value)
                                  }
                                  className="mt-1"
                                  placeholder="fade-in, slide-left, etc."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 self-start">
                            {i > 0 && (
                              <Button
                                type="button"
                                onClick={() => moveSlide(i, i - 1)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Up
                              </Button>
                            )}
                            {i < slidesMeta.length - 1 && (
                              <Button
                                type="button"
                                onClick={() => moveSlide(i, i + 1)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Down
                              </Button>
                            )}
                            <Button
                              type="button"
                              onClick={() => removeSlide(i)}
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {slidesMeta.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No slides
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by adding your first slide.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  onClick={() => nav("/admin")}
                  variant="outline"
                  className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Story...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Create Story
                    </>
                  )}
                </Button>
                {isUploading && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => abortController?.abort()}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md  p-1 "
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel Upload
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
