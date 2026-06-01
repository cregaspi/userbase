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
      if (activeFilters.length > 0) {
        const matchesFilter = activeFilters.some((filter) => {
          if (filter.type === "user")    return post.user?.name === filter.value;
          if (filter.type === "company") return post.user?.company?.name === filter.value;
          return false;
        });
        if (!matchesFilter) return false;
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
      const exists = prev.some((f) => f.value === userName && f.type === "user");
      return exists
        ? prev.filter((f) => !(f.value === userName && f.type === "user"))
        : [...prev, { value: userName, type: "user" }];
    });
  }, []);

  const handleFilterByCompany = useCallback((company: string) => {
    setActiveFilters((prev) => {
      const exists = prev.some((f) => f.value === company && f.type === "company");
      return exists
        ? prev.filter((f) => !(f.value === company && f.type === "company"))
        : [...prev, { value: company, type: "company" }];
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
      <div className="page-container space-y-4">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters.map((f) => f.value)}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        <p className="result-count">
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
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <FileText size={20} />
            </div>
            <p className="empty-state__title">No posts found</p>
            <p className="empty-state__subtitle">Try adjusting your search or clearing filters</p>
            <button onClick={handleClearAll} className="btn-primary" style={{ marginTop: "1rem" }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
