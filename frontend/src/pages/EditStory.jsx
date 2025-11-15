import React, { useEffect, useState } from "react";
import { fetchStory, updateStory } from "../api/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditStory() {
  const { id } = useParams();
  const nav = useNavigate();
  const [story, setStory] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStory(id);
        setStory(data);
        setTitle(data.title);
        setCategory(data.category);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("category", category);

      if (newFiles.length > 0) {
        const slidesPayload = [];
        newFiles.forEach((file) => {
          fd.append("slides", file);
          slidesPayload.push({
            type: file.type.startsWith("video") ? "video" : "image",
            duration: 5000,
            animation: "",
            fileIndex: slidesPayload.length,
          });
        });
        fd.append("slides", JSON.stringify(slidesPayload));
      } else {
        fd.append("slides", JSON.stringify(story.slides || []));
      }

      await updateStory(id, fd);
      setError("");
      setSuccess("Story updated successfully!");
      setTimeout(() => nav("/admin"), 1500);
    } catch (err) {
      console.error(err);
      setError(
        "Update failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!story)
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading story…</CardTitle>
          </CardHeader>
          <CardContent>Fetching story data...</CardContent>
        </Card>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Story</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <h3 className="text-sm font-medium">Existing Slides</h3>
              <div className="mt-3 grid grid-cols-2 sm:flex sm:gap-3 sm:overflow-x-auto gap-2">
                {story.slides.map((sl, idx) => (
                  <div key={idx} className="w-full sm:w-40">
                    {sl.type === "image" ? (
                      <img
                        src={sl.url}
                        alt={sl.alt || `slide-${idx}`}
                        className="w-full h-24 sm:h-28 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={sl.url}
                        className="w-full h-24 sm:h-28 object-cover rounded"
                        controls
                      />
                    )}
                    <div className="text-xs mt-1">
                      {sl.animation || "no anim"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Replace slides (optional)</h3>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setNewFiles(Array.from(e.target.files))}
                className="mt-2 border border-gray-300 rounded px-2 py-1"
              />
              {newFiles.length > 0 && (
                <div className="mt-2 text-sm">
                  {newFiles.length} file(s) selected
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => nav("/admin")}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="hover:bg-blue-600"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
