"use client";

import { useState, useMemo, useCallback } from "react";
import { User, UserDetail, Post } from "@/types/user";
import { FilterBar } from "@/components/FilterBar";
import { UserCard } from "@/components/UserCard";
import { UserModal } from "@/components/UserModal";
import { Users } from "lucide-react";

interface UsersListProps {
  initialUsers: User[];
  initialPosts: Post[];
}

export function UsersList({ initialUsers, initialPosts }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [selectedUserPosts, setSelectedUserPosts] = useState<Post[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialUsers.filter((user) => {
      if (activeFilters.length > 0 && !activeFilters.includes(user.company.name)) return false;
      if (q) {
        return (
          user.name.toLowerCase().includes(q) ||
          user.username.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.company.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialUsers, searchQuery, activeFilters]);

  const handleFilterByCompany = useCallback((company: string) => {
    setActiveFilters((prev) =>
      prev.includes(company) ? prev.filter((f) => f !== company) : [...prev, company]
    );
  }, []);

  const handleRemoveFilter = useCallback((filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters([]);
    setSearchQuery("");
  }, []);

  const handleCardClick = useCallback(async (user: User) => {
    setIsModalOpen(true);
    setIsLoadingUser(true);
    setSelectedUser(null);
    setSelectedUserPosts([]);
    try {
      const res = await fetch(`/api/users/${user.id}`);
      const data: UserDetail = await res.json();
      setSelectedUser(data);
      setSelectedUserPosts(initialPosts.filter((p) => p.userId === user.id));
    } catch {
      setSelectedUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, [initialPosts]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedUserPosts([]);
  }, []);

  return (
    <>
      <div className="page-container space-y-4">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        <p className="result-count">
          {filteredUsers.length === initialUsers.length
            ? `${initialUsers.length} users`
            : `${filteredUsers.length} of ${initialUsers.length} users`}
        </p>

        {filteredUsers.length > 0 ? (
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={handleCardClick}
                onFilterByCompany={handleFilterByCompany}
                activeFilters={activeFilters}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <Users size={20} />
            </div>
            <p className="empty-state__title">No users found</p>
            <p className="empty-state__subtitle">Try adjusting your search or clearing filters</p>
            <button onClick={handleClearAll} className="btn-primary" style={{ marginTop: "1rem" }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          posts={selectedUserPosts}
          isLoading={isLoadingUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
