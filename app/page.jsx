"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { PageHeader } from "@/components/shared/header";
import { CategoryNav } from "@/components/pos/category-nav";
import { SearchBar } from "@/components/pos/search-bar";
import { MenuGrid } from "@/components/pos/menu-grid";
import { OrderCart } from "@/components/pos/order-cart";
import { ItemDetailModal } from "@/components/pos/item-detail-modal";

import { useState } from "react";

const PosPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

  return (
    <div className="relative flex w-full h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      <div className="flex flex-1 transition-all duration-300 ease-in-out">
        <div className="flex flex-col flex-1 m-3">
          <header className="px-4 py-3 border-b">
            <PageHeader
              title="Point of Sales"
              showCartToggle
              toggleSidebar={toggleSidebar}
              toggleCart={toggleCart}
            />
            <CategoryNav />
            <SearchBar />
          </header>
          <MenuGrid cartOpen={cartOpen} setSelectedItem={setSelectedItem} />
        </div>
        <OrderCart cartOpen={cartOpen} toggleCart={toggleCart} />
      </div>
      <ItemDetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

export default PosPage;
