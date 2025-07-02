"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search something sweet on your mind..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 h-9 text-xs bg-white/70 border-gray-200 rounded-lg focus:bg-white transition-all"
      />
    </div>
  );
}
