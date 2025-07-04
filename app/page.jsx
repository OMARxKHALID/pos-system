"use client";

import { PageHeader } from "@/components/shared/header";
import { CategoryNav } from "@/components/pos/category-nav";
import { SearchBar } from "@/components/pos/search-bar";
import { MenuGrid } from "@/components/pos/menu-grid";
import { OrderCart } from "@/components/pos/order-cart";
import { ItemDetailModal } from "@/components/pos/item-detail-modal";
import { CategoryNavSkeleton } from "@/components/pos/category-nav-skeleton";
import { SearchBarSkeleton } from "@/components/pos/search-bar-skeleton";
import { useCategory } from "@/hooks/use-category";
import { useMenu } from "@/hooks/use-menu";
import { useState } from "react";

export default function PosPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading: categoriesLoading } = useCategory();
  const { isLoading: menuLoading } = useMenu();

  const toggleCart = () => setCartOpen((prev) => !prev);

  const isLoading = categoriesLoading || menuLoading;

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Mobile Layout */}
      <div className="flex flex-col h-full lg:hidden">
        <div className="flex flex-col flex-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/60 overflow-hidden">
          <div className="flex-shrink-0 px-2 py-2">
            <PageHeader
              title="POS"
              showCartToggle
              toggleCart={toggleCart}
              showDashboard
              showDateTime
            />
            {isLoading ? (
              <CategoryNavSkeleton />
            ) : (
              <CategoryNav
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
            {isLoading ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onItemSelect={setSelectedItem}
            />
          </div>
        </div>
        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm">
            <div className="absolute inset-x-0 bottom-0 top-0">
              <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} isMobile />
            </div>
          </div>
        )}
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/60 overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-6 py-4">
            <PageHeader
              title="POS"
              showCartToggle
              toggleCart={toggleCart}
              showDashboard
              showDateTime
            />
            {isLoading ? (
              <CategoryNavSkeleton />
            ) : (
              <CategoryNav
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
            {isLoading ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <MenuGrid
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onItemSelect={setSelectedItem}
            />
          </div>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            cartOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} />
        </div>
      </div>
      <ItemDetailModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
