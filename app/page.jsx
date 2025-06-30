"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Edit3, X, Minus, Plus, Check } from "lucide-react";
import Image from "next/image";
import { categories, menuItems, orderTracking } from "@/data/menu-data";
import { Sidebar } from "@/components/shared/sidebar";
import { PageHeader } from "@/components/shared/header";
import { usePOSStore } from "@/hooks/use-pos-store";

const PosPage = () => {
  const {
    sidebarOpen,
    cartOpen,
    toggleSidebar,
    toggleCart,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    orderItems,
    updateQuantity,
    addToCart,
    selectedTable,
    setTable,
    selectedOrderType,
    setOrderType,
    promoApplied,
    togglePromo,
    customerName,
    orderNumber,
  } = usePOSStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const searchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const discount = promoApplied ? 1.0 : 0;
  const total = subtotal + tax - discount;

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, modalQuantity);
    setSelectedItem(null);
    setModalQuantity(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Sandwich: "bg-orange-50 text-orange-700 border-orange-200",
      Pastry: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Donut: "bg-pink-50 text-pink-700 border-pink-200",
      Cake: "bg-purple-50 text-purple-700 border-purple-200",
      Bread: "bg-amber-50 text-amber-700 border-amber-200",
      Tart: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="relative flex w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-1 transition-all duration-300 ease-in-out">
        {/* Menu Panel */}
        <div className="flex flex-col flex-1 m-3 overflow-hidden transition-all duration-300 ease-in-out border bg-white/70 backdrop-blur-xl rounded-2xl border-white/50">
          {/* Header */}
          <header className="px-4 py-3 border-b border-slate-200/50 bg-white/30">
            <PageHeader title="Point of Sales" showCartToggle />

            {/* Categories */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  className={`flex flex-col items-center px-3 py-2 h-auto min-w-[70px] rounded-xl text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-sm mb-0.5">{category.icon}</div>
                  <div className="text-xs font-medium leading-tight">
                    {category.name}
                  </div>
                  <div className="text-xs opacity-75">{category.count}</div>
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search something sweet on your mind"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs h-9 bg-slate-50 border-slate-200 rounded-xl placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
          </header>

          {/* Menu Grid */}
          <div className="flex-1 px-4 py-3 overflow-y-auto">
            <div
              className={`grid gap-3 transition-all duration-300 ${
                cartOpen
                  ? "grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
              }`}
            >
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="transition-all duration-200 border cursor-pointer bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-xl group"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-2.5">
                    <div className="flex items-center justify-center mb-2 transition-colors rounded-lg aspect-square bg-slate-50 group-hover:bg-slate-100">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-xs mb-1.5 text-slate-800 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                    <Badge
                      className={`text-xs mb-1.5 border rounded-md px-1.5 py-0.5 ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </Badge>
                    <p className="text-sm font-bold text-slate-800">
                      ${item.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="mt-8 text-center text-slate-400">
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>

          {/* Track Order */}
          <div className="px-4 py-3 border-t border-slate-200/50 bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  Track Order
                </span>
                <Badge className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {orderTracking.length}
                </Badge>
              </div>
            </div>

            <div
              className={`grid gap-4 transition-all duration-300 ${
                cartOpen ? "grid-cols-4" : "grid-cols-6 xl:grid-cols-8"
              }`}
            >
              {orderTracking.map((order, index) => (
                <div key={index} className="text-center">
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarFallback className="text-sm font-semibold text-gray-600 bg-gray-200">
                      {order.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mb-1 text-sm font-semibold text-gray-800">
                    {order.name}
                  </p>
                  <p className="mb-2 text-xs text-gray-500">{order.table}</p>
                  <Badge
                    className={`text-xs mb-2 border-0 rounded-md px-2 py-1 ${order.statusColor}`}
                  >
                    {order.status}
                  </Badge>
                  <p className="text-xs text-gray-400">{order.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Cart */}
        <div
          className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col overflow-hidden border border-white/50 transition-all duration-300 ease-in-out ${
            cartOpen
              ? "w-[320px] opacity-100 translate-x-0 m-3 ml-1.5"
              : "w-0 opacity-0 translate-x-full pointer-events-none m-0"
          }`}
        >
          {/* Cart Header */}
          <header className="px-4 py-4 border-b border-slate-200/50 bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {customerName}
                </h2>
                <p className="text-xs text-slate-500">
                  Order Number: {orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 rounded-lg"
                >
                  <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 rounded-lg lg:hidden"
                  onClick={toggleCart}
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={selectedTable} onValueChange={setTable}>
                <SelectTrigger className="flex-1 text-xs rounded-lg h-9 border-slate-200">
                  <SelectValue placeholder="Select Table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Table 01">Table 01</SelectItem>
                  <SelectItem value="Table 02">Table 02</SelectItem>
                  <SelectItem value="Table 03">Table 03</SelectItem>
                  <SelectItem value="Table 04">Table 04</SelectItem>
                  <SelectItem value="Table 05">Table 05</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedOrderType} onValueChange={setOrderType}>
                <SelectTrigger className="flex-1 text-xs rounded-lg h-9 border-slate-200">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dine In">Dine In</SelectItem>
                  <SelectItem value="Take Away">Take Away</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* Order Items */}
          <main className="flex-1 p-4 overflow-y-auto">
            {orderItems.length === 0 ? (
              <div className="mt-8 text-center text-slate-400">
                <p className="text-sm font-medium">No Item Selected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <Card
                    key={item.id}
                    className="flex items-center gap-3 p-2 border-0 rounded-lg shadow-none bg-white/50"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold truncate text-slate-800">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    {(index === 1 || index === 2) && (
                      <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-6 h-6 bg-transparent rounded text-slate-400 border-slate-200"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-xs font-semibold text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-6 h-6 bg-transparent rounded text-slate-400 border-slate-200"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>

          {/* Order Summary */}
          <Card className="bg-transparent border-0 rounded-none shadow-none">
            <CardContent className="p-4 border-t border-slate-200/50 bg-white/30">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    $ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Tax (10%)</span>
                  <span className="font-semibold text-slate-800">
                    $ {tax.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-600">Discount</span>
                    <span className="font-semibold text-emerald-600">
                      -$ {discount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2 mb-4 text-sm font-bold border-t border-slate-200">
                <span className="text-slate-800">TOTAL</span>
                <span className="text-slate-800">$ {total.toFixed(2)}</span>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  variant={promoApplied ? "default" : "outline"}
                  className={`flex-1 h-8 rounded-lg text-xs ${
                    promoApplied
                      ? "bg-emerald-500 text-white"
                      : "border-slate-200 text-slate-600"
                  }`}
                  onClick={togglePromo}
                >
                  {promoApplied ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Promo Applied
                    </>
                  ) : (
                    "Add Promo"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-8 text-xs bg-transparent rounded-lg border-slate-200 text-slate-600"
                >
                  QRIS
                </Button>
              </div>

              <Button className="w-full h-10 text-sm font-semibold text-white bg-blue-500 rounded-xl">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-xs border bg-white/95 backdrop-blur-xl border-white/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800">
                  Detail Menu
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedItem(null)}
                  className="w-6 h-6 rounded-lg"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-lg bg-slate-50">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  width={60}
                  height={60}
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="mb-3 text-center">
                <Badge
                  className={`mb-2 border rounded-md text-xs ${getCategoryColor(
                    selectedItem.category
                  )}`}
                >
                  {selectedItem.category}
                </Badge>
                <h3 className="mb-1 text-sm font-bold text-slate-800">
                  {selectedItem.name}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  ${selectedItem.price.toFixed(2)}
                </p>
              </div>

              <Input
                placeholder="Add notes..."
                className="h-8 mb-3 text-xs border-slate-200 focus:border-blue-300 focus:ring-blue-200"
              />

              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-transparent border-slate-200"
                  onClick={() =>
                    setModalQuantity(Math.max(1, modalQuantity - 1))
                  }
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-sm font-bold">{modalQuantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-transparent border-slate-200"
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Button
                className="w-full text-xs font-semibold text-white bg-blue-500 rounded-lg h-9"
                onClick={handleAddToCart}
              >
                Add to Cart ($
                {(selectedItem.price * modalQuantity).toFixed(2)})
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PosPage;
