"use client";

import { useState, useMemo, useCallback } from "react";
import { PostWithUser } from "@/types/user";
import { PostCard } from "@/components/PostCard";
import { PostModal } from "@/components/PostModal";
import { FilterBar } from "@/components/FilterBar";
import { FileText } from "lucide-react";

interface PostsListProps {
  posts: PostWithUser[];
}

interface FilterItem {
  value: string;
  type: "user" | "company";
}

export function PostsList({ posts }: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithUser | null>(null);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      // Apply filters
      if (activeFilters.length > 0) {
        const matchesFilter = activeFilters.some((filter) => {
          if (filter.type === "user") {
            return post.user?.name === filter.value;
          } else if (filter.type === "company") {
            return post.user?.company?.name === filter.value;
          }
          return false;
        });
        if (!matchesFilter) {
          return false;
        }
      }

      if (q) {
        return (
          post.title?.toLowerCase().includes(q) ||
          post.body?.toLowerCase().includes(q) ||
          post.user?.name?.toLowerCase().includes(q) ||
          post.user?.username?.toLowerCase().includes(q) ||
          post.user?.email?.toLowerCase().includes(q) ||
          post.user?.company?.name?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [posts, searchQuery, activeFilters]);

  const handleFilterByUser = useCallback((userName: string) => {
    setActiveFilters((prev) => {
      const filterExists = prev.some((f) => f.value === userName && f.type === "user");
      if (filterExists) {
        return prev.filter((f) => !(f.value === userName && f.type === "user"));
      } else {
        return [...prev, { value: userName, type: "user" }];
      }
    });
  }, []);

  const handleFilterByCompany = useCallback((company: string) => {
    setActiveFilters((prev) => {
      const filterExists = prev.some((f) => f.value === company && f.type === "company");
      if (filterExists) {
        return prev.filter((f) => !(f.value === company && f.type === "company"));
      } else {
        return [...prev, { value: company, type: "company" }];
      }
    });
  }, []);

  const handleRemoveFilter = useCallback((filterValue: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.value !== filterValue));
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters([]);
    setSearchQuery("");
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters.map((f) => f.value)}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          {filteredPosts.length === posts.length
            ? `${posts.length} posts`
            : `${filteredPosts.length} of ${posts.length} posts`}
        </p>

        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={setSelectedPost}
                onUserNameClick={handleFilterByUser}
                onCompanyClick={handleFilterByCompany}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--surface-2)" }}
            >
              <FileText size={20} style={{ color: "var(--ink-muted)" }} />
            </div>
            <p className="font-medium mb-1" style={{ color: "var(--ink)" }}>
              No posts found
            </p>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
              Try adjusting your search or clearing filters
            </p>
            <button
              onClick={handleClearAll}
              className="mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-100"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
