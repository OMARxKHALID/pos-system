"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useState } from "react";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <Input
        placeholder="Search something sweet on your mind"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 text-xs h-9 bg-slate-50 border-slate-200 rounded-xl placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-200"
      />
    </div>
  );
};
