"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { PageHeader } from "@/components/shared/header";
import { usePOSStore } from "@/hooks/use-pos-store";
import { CategoryNav } from "@/components/pos/category-nav";
import { SearchBar } from "@/components/pos/search-bar";
import { MenuGrid } from "@/components/pos/menu-grid";
import { TrackOrder } from "@/components/pos/track-order";
import { OrderCart } from "@/components/pos/order-cart";
import { ItemDetailModal } from "@/components/pos/item-detail-modal";

const PosPage = () => {
  const { sidebarOpen, toggleSidebar } = usePOSStore();

  return (
    <div className="relative flex w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      <div className="flex flex-1 transition-all duration-300 ease-in-out">
        <div className="flex flex-col flex-1 m-3 overflow-hidden transition-all duration-300 ease-in-out border bg-white/70 backdrop-blur-xl rounded-2xl border-white/50">
          <header className="px-4 py-3 border-b border-slate-200/50 bg-white/30">
            <PageHeader title="Point of Sales" showCartToggle />
            <CategoryNav />
            <SearchBar />
          </header>
          <MenuGrid />
          <TrackOrder />
        </div>
        <OrderCart />
      </div>
      <ItemDetailModal />
    </div>
  );
};

export default PosPage;
