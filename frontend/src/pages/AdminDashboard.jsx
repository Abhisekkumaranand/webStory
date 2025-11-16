import React, { useEffect, useState } from "react";
import { fetchStories, deleteStory } from "../api/api.js";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchStories();
      setStories(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load stories: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await deleteStory(id);
      load();
    } catch (err) {
      setError(
        "Delete failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="p-2 md:p-6">
      <Card className="rounded-xl shadow-lg border-0 bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </CardTitle>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {stories.length}
            </span>
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                List
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Grid
              </Button>
            </div>
            <Link to="/admin/new">
              <Button className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto">
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
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
                Add Story
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {error && (
            <div className="text-red-600 mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* View */}
          <div className="block">
            {viewMode === "list" ? (
              <>
                <div className="md:hidden space-y-4">
                  {stories.map((s) => (
                    <Card
                      key={s._id}
                      className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 rounded-xl overflow-hidden"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="space-y-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-xl md:text-2xl leading-tight mb-3">
                                {s.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                                  {s.category}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
                                  {s.slides?.length || 0} slides
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-2 rounded-lg">
                            Created:{" "}
                            {new Date(s.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => nav(`/admin/edit/${s._id}`)}
                              className="flex items-center gap-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300 rounded-lg px-3 py-1"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="xs"
                              onClick={() => handleDelete(s._id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1"
                            >
                              <svg
                                className="w-3 h-3"
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
                              Delete
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => nav(`/story/${s._id}`)}
                              className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg px-3 py-1"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[720px] table-auto border-collapse border border-gray-200 rounded-xl shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left">
                        <th className="p-4 font-semibold text-gray-900 border-b border-gray-200 rounded-tl-xl">
                          Title
                        </th>
                        <th className="p-4 font-semibold text-gray-900 border-b border-gray-200">
                          Category
                        </th>
                        <th className="p-4 font-semibold text-gray-900 border-b border-gray-200">
                          Created
                        </th>
                        <th className="p-4 font-semibold text-gray-900 border-b border-gray-200">
                          Slides
                        </th>
                        <th className="p-4 font-semibold text-gray-900 border-b border-gray-200 rounded-tr-xl">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stories.map((s, index) => (
                        <tr
                          key={s._id}
                          className={`hover:bg-blue-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="p-4 border-b border-gray-200">
                            <div className="font-medium text-gray-900">
                              {s.title}
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
                              {s.category}
                            </span>
                          </td>
                          <td className="p-4 border-b border-gray-200 text-sm text-gray-600">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                              {s.slides?.length || 0} slides
                            </span>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => nav(`/admin/edit/${s._id}`)}
                                className="p-2 rounded-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300"
                                title="Edit"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(s._id)}
                                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                title="Delete"
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
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => nav(`/story/${s._id}`)}
                                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                title="View"
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((s) => (
                  <Card
                    key={s._id}
                    className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 rounded-xl overflow-hidden"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-xl md:text-2xl leading-tight mb-3">
                              {s.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                                {s.category}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
                                {s.slides?.length || 0} slides
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-2 rounded-lg">
                          Created: {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => nav(`/admin/edit/${s._id}`)}
                            className="flex items-center gap-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300 rounded-lg px-3 py-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => handleDelete(s._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1"
                          >
                            <svg
                              className="w-3 h-3"
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
                            Delete
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => nav(`/story/${s._id}`)}
                            className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg px-3 py-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
