"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Package, FileText, LogOut, X, Menu } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Report", icon: BarChart3 },
  { href: "/admin/menu", label: "Inventory", icon: Package },
  { href: "/admin/orders", label: "Activity", icon: FileText },
];

const NavLink = ({ href, label, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-5 px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-500 hover:bg-gray-50"
      }`}
      prefetch={false}
      style={{ minHeight: "56px" }}
    >
      <Icon
        className={`w-7 h-7 ${isActive ? "text-blue-600" : "text-gray-400"}`}
      />
      {label}
    </Link>
  );
};

export default function ProtectedAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen">
      {/* Mobile Sidebar Trigger */}
      <div className="fixed z-20 md:hidden top-4 left-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed h-full w-[300px] border-r">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-[300px] pt-4 md:pt-0">{children}</main>
    </div>
  );
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full p-6 bg-white">
      {/* User Section */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 shadow-md">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight text-gray-900">
                Jelly Grande
              </span>
              <span className="text-sm font-medium text-gray-400">Cashier</span>
            </div>
          </div>
          {onClose && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-red-500 md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>
        <nav className="flex flex-col gap-3 mt-2">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <form action="/api/auth/signout" method="post" className="mt-auto">
        <Separator className="mb-4" />
        <Button
          type="submit"
          variant="ghost"
          className="flex items-center justify-center w-full gap-3 py-3 text-lg font-semibold text-red-500 rounded-xl"
        >
          <LogOut className="w-6 h-6" /> Log Out
        </Button>
      </form>
    </div>
  );
}
