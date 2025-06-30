"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  X,
  ShoppingCart,
  Activity,
  FileText,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { usePOSStore } from "@/hooks/use-pos-store";

const navigationItems = [
  {
    id: "pos",
    label: "Point of Sales",
    icon: <ShoppingCart className="w-4 h-4" />,
    path: "/",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity className="w-4 h-4" />,
    path: "/activity",
  },
  {
    id: "report",
    label: "Report",
    icon: <FileText className="w-4 h-4" />,
    path: "/report",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <Package className="w-4 h-4" />,
    path: "/inventory",
  },
  {
    id: "teams",
    label: "Teams",
    icon: <Users className="w-4 h-4" />,
    path: "/teams",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    path: "/settings",
  },
];

const SidebarHeader = ({ onClose }) => (
  <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-white/40 to-white/20">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-white/50">
          <AvatarImage
            src="/placeholder.svg?height=48&width=48"
            alt="Jelly Grande"
          />
          <AvatarFallback className="text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600">
            JG
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Select defaultValue="jelly-grande">
            <SelectTrigger className="h-auto p-0 bg-transparent border-0 shadow-none focus:ring-0">
              <div className="text-left">
                <div className="text-lg font-bold text-slate-800">
                  Jelly Grande
                </div>
                <div className="text-sm font-medium text-slate-500">
                  Cashier
                </div>
              </div>
              <ChevronDown className="w-4 h-4 ml-3 text-slate-400" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jelly-grande">Jelly Grande</SelectItem>
              <SelectItem value="other-user">Other User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="w-8 h-8 transition-all duration-200 rounded-xl text-slate-400"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
    <div className="text-center">
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
        Bakehouse POS
      </h2>
      <p className="mt-1 text-xs text-slate-500">Point of Sales System</p>
    </div>
  </div>
);

const SidebarNav = ({ pathname, onNavigate }) => (
  <nav className="flex-1 p-6">
    <div className="space-y-2">
      <div className="px-3 mb-4 text-xs font-semibold tracking-wider uppercase text-slate-400">
        Main Menu
      </div>
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`w-full justify-start h-12 px-4 rounded-2xl font-medium text-sm transition-all duration-200 group ${
            pathname === item.path
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              : "text-slate-600"
          }`}
          onClick={() => onNavigate(item)}
        >
          <div
            className={`mr-4 p-2 rounded-xl transition-all duration-200 ${
              pathname === item.path
                ? "bg-white/20"
                : "bg-slate-100 group-hover:bg-white/80"
            }`}
          >
            {item.icon}
          </div>
          <span className="font-semibold">{item.label}</span>
        </Button>
      ))}
    </div>
  </nav>
);

const SidebarFooter = ({ onLogout }) => (
  <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-white/40 to-white/20">
    <Button
      variant="ghost"
      className="justify-start w-full h-12 px-4 text-sm font-medium transition-all duration-200 rounded-2xl text-slate-600"
      onClick={onLogout}
    >
      <div className="flex items-center justify-center w-10 h-10 mr-4 bg-red-100 rounded-xl">
        <LogOut className="w-4 h-4 text-red-600" />
      </div>
      <span className="font-semibold">Log Out</span>
    </Button>
    <div className="pt-4 mt-4 border-t border-slate-200/40">
      <p className="text-xs text-center text-slate-400">© 2024 Bakehouse POS</p>
      <p className="mt-1 text-xs text-center text-slate-400">Version 1.0.0</p>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentPage } = usePOSStore();

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleNavigationClick = (item) => {
    setCurrentPage(item.id);
    router.push(item.path);
    onClose();
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300 bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        />
      )}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-white/60 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <SidebarHeader onClose={onClose} />
          <SidebarNav pathname={pathname} onNavigate={handleNavigationClick} />
          <SidebarFooter onLogout={handleLogout} />
        </div>
      </div>
    </>
  );
};

export { Sidebar };
