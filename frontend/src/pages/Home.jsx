import React, { useEffect, useState } from "react";
import { fetchStories } from "../api/api.js";
import StoryCard from "../components/StoryCard.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStories();
        setStories(data);
        setCategories(
          Array.from(new Set(data.map((s) => s.category || "General")))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Hero Section */}
      <div className="text-center py-16 px-8 bg-gray-50 rounded-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to StoryHub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover, create, and share amazing interactive stories. Explore stories by category and let your imagination run wild.
        </p>
      </div>

      <div className="max-w-7xl mx-auto   pb-16">
        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create an amazing interactive story!</p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Create Your First Story
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Explore Stories</h2>
              <p className="text-gray-600">Browse through our collection of interactive stories</p>
            </div>

            {categories.map((cat) => (
              <section key={cat} className="mb-8 md:mb-16 bg-gray-50 rounded-2xl p-4 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-8 border-b border-gray-300 pb-2 md:pb-4">{cat}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                  {stories
                    .filter((s) => (s.category || "General") === cat)
                    .map((s) => (
                      <StoryCard key={s._id} story={s} to={`/story/${s._id}`} />
                    ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
