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
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

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
  <div className="p-6 border-b border-border bg-card">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-border">
          <AvatarImage
            src="/placeholder.svg?height=48&width=48"
            alt="Jelly Grande"
          />
          <AvatarFallback className="text-lg font-bold text-card-foreground bg-primary">
            JG
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Select defaultValue="jelly-grande">
            <SelectTrigger className="h-auto p-0 bg-transparent border-0 shadow-none focus:ring-0 focus:outline-none">
              <div className="text-left">
                <div className="text-lg font-bold text-card-foreground">
                  Jelly Grande
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Cashier
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="border-border rounded-xl bg-card">
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
        className="w-8 h-8 rounded-xl text-muted-foreground"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
    <div className="text-center">
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
        Bakehouse POS
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Point of Sales System
      </p>
    </div>
  </div>
);

const SidebarNav = ({ pathname, onNavigate }) => (
  <nav className="flex-1 p-6">
    <div className="space-y-2">
      <div className="px-3 mb-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
        Main Menu
      </div>
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`w-full justify-start h-12 px-4 rounded-2xl font-medium text-sm transition-all duration-200 group ${
            pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => onNavigate(item)}
        >
          <div
            className={`mr-4 p-2 rounded-xl ${
              pathname === item.path
                ? "bg-primary-foreground/10"
                : "bg-muted group-hover:bg-accent"
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
  <div className="p-6 border-t border-border bg-card">
    <Button
      variant="ghost"
      className="justify-start w-full h-12 px-4 text-sm font-medium rounded-2xl text-muted-foreground"
      onClick={onLogout}
    >
      <div className="flex items-center justify-center w-10 h-10 mr-4 bg-destructive/10 rounded-xl">
        <LogOut className="w-4 h-4 text-destructive" />
      </div>
      <span className="font-semibold">Log Out</span>
    </Button>
    <div className="pt-4 mt-4 border-t border-border">
      <p className="text-xs text-center text-muted-foreground">
        © 2024 Bakehouse POS
      </p>
      <p className="mt-1 text-xs text-center text-muted-foreground">
        Version 1.0.0
      </p>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

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
        />
      )}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-card backdrop-blur-xl border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Main navigation"
        tabIndex={0}
        onKeyDown={handleKeyDown}
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
